import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHistory } from './transaction-history.entity';

@Injectable()
export class TransactionHistoryService {

    constructor(
        @InjectRepository(TransactionHistory) 
        private readonly transactionRepo : Repository<TransactionHistory> ){}

        async storeEvent(userId: string, type: string, amount: number, fromwalletId?: string, toWalletId?: string  ){
            return await this.transactionRepo.create({
                userId: userId,
                amount: amount,
                fromWalletId: fromwalletId,
                toWalletId: toWalletId,
                type: type

            })
        }

        async getTransactionHistory( userId: string){
            return await this.transactionRepo.findOne({where:{ userId}})
        }
}
