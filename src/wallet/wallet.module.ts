import { Module } from '@nestjs/common';

import {CacheModule} from "@nestjs/cache-manager"
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { DataSource, Repository } from 'typeorm';
import { IdempotencyModule } from '../idempotency/idempotency.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [CacheModule.register({
    ttl: 60,
    isGlobal: true

  }),
  TypeOrmModule.forRoot({
    type:  'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    //entities: [Wallet, User],
    synchronize: true
    
  }),
  TypeOrmModule.forFeature([Wallet, IdempotencyRecord, User]), IdempotencyModule, ]
  , 
  
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService]

})
export class WalletModule {}
