import { BadGatewayException, BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private dataSource: DataSource,
        @InjectRepository(IdempotencyRecord)
       private idempotencyrecord: Repository<IdempotencyRecord>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache 
    ){} 

    async createWallet(userId: number, currency: string): Promise<Wallet>{
        const wallet = this.walletRepository.create({userId, currency, balance:0})
        const savedWallet = this.walletRepository.save(wallet);
        

        await this.cacheManager.del(`wallets:${userId}`);
        return savedWallet;
    }
    
    async getWalletsByUser(userId: number): Promise<Wallet[]>{
        const cacheKey = `wallets:${userId}`;
        
        let wallets = await this.cacheManager.get<Wallet[]>(cacheKey)
        if(wallets){
            return wallets
        }
        wallets = await this.walletRepository.find({where: {userId: userId}})
        await this.cacheManager.set(cacheKey, wallets)
        return  wallets
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
        const updatedWallet =  await this.dataSource.transaction(async (manager)=>{
            const wallet = await manager.findOne(Wallet, 
                { where: {id: walletid},
                lock: {mode: 'pessimistic_write'}
            })
            if (!wallet){
                throw new NotFoundException('Wallet Not Found')
            }

            wallet.balance = Number(wallet.balance) + amount;
            const savedWallet = await manager.save(wallet)

            const record = manager.create(IdempotencyRecord,{
                key: idempotencyKey,
                walletId: walletid,
                transactionType: "deposit",
                amount
            })
            await manager.save(record)
            return savedWallet
            
        })
        const walletEntity = await this.walletRepository.findOne({where:{ id: walletid}})
        if (walletEntity){
            await this.cacheManager.del(`wallets:${walletEntity?.userId}`)
        }

        return updatedWallet
        

      
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

        const updatedWallet =  await this.dataSource.transaction(async(manager)=>{
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
            const savedWallet = await manager.save(wallet)

            const record = manager.create(IdempotencyRecord,{
                key: idempotencyKey,
                walletId,
                transactionType: 'withdraw',
                amount
            })

            await manager.save(record)
            return savedWallet
        })

        const walletEntity = await this.walletRepository.findOne({where: {id: walletId}})
        if(walletEntity){
            await this.cacheManager.del(`wallets:${walletEntity.id}`)
        }
        return updatedWallet
    }


}
