import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Wallet } from 'src/wallet/wallet.entity';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction, Wallet,IdempotencyRecord])],
    providers: [TransactionService],
    controllers: [TransactionController],
    exports: [TransactionService]
})
export class TransactionModule {}
