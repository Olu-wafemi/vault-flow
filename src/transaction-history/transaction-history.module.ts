import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionHistoryModule])
    ]
})
export class TransactionHistoryModule {}
