import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private dataSource: DataSource,
        private readonly idempotencyrecord: Repository<IdempotencyRecord>
        
    
    ){} 

    async createWallet(userId: number, currency: string): Promise<Wallet>{
        const wallet = this.walletRepository.create({userId, currency, balance:0})
        return this.walletRepository.save(wallet);
    }
    
    async getWalletsByUser(userId: number): Promise<Wallet[]>{
        return this.walletRepository.find({where: { userId: userId}})
    }

    async deposit(walletid: string, amount: number, idempotencyKey: string): Promise<Wallet | null>{
        if(amount <= 0){
            throw new BadGatewayException("Amount must be greater than zero")
        }

        const existingRecord = await this.idempotencyrecord.findOne({
            where: {key: idempotencyKey,walletId: walletid, transactionType: 'deposit' }
        })
        if(existingRecord){
            return this.walletRepository.findOne({where: {id: walletid}});
        }
        return await this.dataSource.transaction(async (manager)=>{
            const wallet = await manager.findOne(Wallet, 
                { where: {id: walletid},
                lock: {mode: 'pessimistic_write'}
            })
            if (!wallet){
                throw new NotFoundException('Wallet Not Found')
            }

            wallet.balance = Number(wallet.balance) + amount;
            const updatedWallet = await manager.save(wallet)

            const record = manager.create(IdempotencyRecord,{
                key: idempotencyKey,
                walletId: walletid,
                transactionType: "deposit",
                amount
            })
            await manager.save(record)
            return updatedWallet
        })
    }

    async withdraw(walletId: string, amount: number, idempotencyKey: string): Promise<Wallet| null>{
        if(amount <= 0){
            throw new BadRequestException("Amount must be greater than zero")

        }

        const existingRecord = await this.idempotencyrecord.findOne({
            where: {key: idempotencyKey, walletId, transactionType: 'withdraw'}
        })

        if(existingRecord){
            return this.walletRepository.findOne({where: {id: walletId}});

        }

        return await this.dataSource.transaction(async(manager)=>{
            const wallet = await manager.findOne(Wallet, 
                {where:{id: walletId},
                lock: {mode: 'pessimistic_write'}
            });

            if(!wallet){
                throw new NotFoundException("Wallet not Found");
            }
            if(Number(wallet.balance) < amount){
                throw new BadRequestException("Insufficient Funds")
            }

            wallet.balance = Number(wallet.balance) - amount;
            const updatedWallet = await manager.save(wallet)

            const record = manager.create(IdempotencyRecord,{
                key: idempotencyKey,
                walletId,
                transactionType: 'withdraw',
                amount
            })

            await manager.save(record)
            return updatedWallet
        })
    }


}
