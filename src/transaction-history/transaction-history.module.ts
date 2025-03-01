import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryKafkaController } from './transaction-history.kafka.controller';
import { TransactionHistory } from './transaction-history.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionHistory])
    ],
    providers: [TransactionHistoryService],
    controllers: [TransactionHistoryController, TransactionHistoryKafkaController]
})
export class TransactionHistoryModule {}
