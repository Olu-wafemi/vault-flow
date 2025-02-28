import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistoryService } from './transaction-history.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionHistoryModule])
    ],
    providers: [TransactionHistoryService]
})
export class TransactionHistoryModule {}
