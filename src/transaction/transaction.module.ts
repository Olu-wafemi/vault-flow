import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { Transaction } from './transaction.entity';

@Module({

    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            //entities: [Wallet, User],
            synchronize: true

        }),

        TypeOrmModule.forFeature([Transaction, IdempotencyRecord])],
    providers: [TransactionService,],
    controllers: [TransactionController],
    exports: [TransactionService]
})
export class TransactionModule { }
