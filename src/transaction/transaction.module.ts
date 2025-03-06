import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { Transaction } from './transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({

    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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

        ClientsModule.register([
            {
                name: "KAFKA_SERVICE",
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'transaction-service',
                        brokers: ['localjost: 9092']
                    },
                    consumer: {
                        groupId: 'transaction-consumer'
                    }
                }

            }
        ]),

        TypeOrmModule.forFeature([Transaction, IdempotencyRecord])],
    providers: [TransactionService,],
    controllers: [TransactionController],
    exports: [TransactionService]
})
export class TransactionModule { }
