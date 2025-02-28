import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionHistoryModule])
    ],
    providers: [TransactionHistoryService],
    controllers: [TransactionHistoryController]
})
export class TransactionHistoryModule {}
