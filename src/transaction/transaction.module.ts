import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';
import { Transaction } from './transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction,IdempotencyRecord])],
    providers: [TransactionService,],
   controllers: [TransactionController],
    exports: [TransactionService]
})
export class TransactionModule {}
