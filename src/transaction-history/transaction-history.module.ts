import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryKafkaController } from './transaction-history.kafka.controller';
import { TransactionHistory } from './transaction-history.entity';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true

        }),

        ClientsModule.register([
            {
                name: "KAFKA_SERVICE",
                transport: Transport.KAFKA,
                options:{
                    client:{
                        clientId: 'transaction-history-service',
                        brokers: ['localhost:9092']
                    },
                    consumer:{
                        groupId: 'transaction-history-group'
                    }
                }
            }
        ]),
        TypeOrmModule.forFeature([TransactionHistory]),

    ],
    providers: [TransactionHistoryService],
    controllers: [TransactionHistoryController, TransactionHistoryKafkaController]
})
export class TransactionHistoryModule {}
