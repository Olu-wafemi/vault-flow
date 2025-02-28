import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHistory } from './transaction-history.entity';

@Injectable()
export class TransactionHistoryService {
    private readonly logger =  new Logger(TransactionHistoryService.name);
    constructor(
        @InjectRepository(TransactionHistory) 
        private readonly transactionRepo : Repository<TransactionHistory> ){}

        async storeEvent(event: Partial<TransactionHistory> ): Promise<TransactionHistory>{
            const record =  await this.transactionRepo.create(event)
            const savedRecord = await this.transactionRepo.save(record)
            this.logger.log(`Transaction recorded: ${savedRecord.id}`)
            return savedRecord
        }

        async getTransactionsByUser( userId: string){
            return await this.transactionRepo.find({where:{ userId},
            order: {timestamp: "DESC"}})
        }
}
