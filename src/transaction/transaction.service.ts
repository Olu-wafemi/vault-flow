import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import {Transaction} from "./transaction.entity"
@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Wallet)
        private walletRepo: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        @InjectRepository(IdempotencyRecord)
        private idempotencyRecord: Repository<IdempotencyRecord>,
        private dataSource: DataSource
    ){}

    async transferfunds(
        fromWalletId: string,
        toWalletId: string,
        amount: number,
        idempotencyKey: string
     ): Promise<Transaction| null>{

        if(amount<=0){
            throw new BadRequestException('Amount must be greater than zero')
        }

        const existingRecord = await this.idempotencyRecord.findOne({where: {key: idempotencyKey, walletId: fromWalletId, transactionType: 'transfer'}})
        if(existingRecord){
            return  this.transactionRepo.findOne({where: {id: existingRecord.transactionId}})
        }

        return await this.dataSource.transaction(async(manager)=>{

            const [sourceWallet, destinationWallet] = await Promise.all([
                manager.findOne(Wallet, {
                    where: {id: fromWalletId},
                    lock: {mode: "pessimistic_write"}
                }),
                manager.findOne(Wallet, {
                    where: {id: toWalletId},
                    lock: {mode: "pessimistic_write"}
                })
            ])
            if(!sourceWallet){
                throw new NotFoundException("Source wallet not found")

            }
            if(!destinationWallet){
                throw new NotFoundException("Destionation wallet not Found")
            }

            if(Number(sourceWallet.balance) < amount){
                throw new BadGatewayException('Insufficient funds in source wallet')
            }

            sourceWallet.balance = Number(sourceWallet.balance) - amount;
            destinationWallet.balance = Number(destinationWallet.balance) + amount

            await manager.save(Wallet, [sourceWallet, destinationWallet])

            const transactionRecord = manager.create(Transaction, {
                fromWalletId,
                toWalletId,
                amount,
                idempotencyKey,
            })
            const savedTransaction = await manager.save(Transaction, transactionRecord)

            const idempotencyRecord = manager.create(IdempotencyRecord, {
                key: idempotencyKey,
                walletId: fromWalletId,
                transactionType: "transfer",
                transactionId: savedTransaction.id,
                amount
            })
            await manager.save(IdempotencyRecord, idempotencyRecord)
            return savedTransaction
        })

    }
}
