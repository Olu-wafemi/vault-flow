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
  TypeOrmModule.forFeature([Wallet, IdempotencyRecord, User]), IdempotencyModule]
  , 
  
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService]

})
export class WalletModule {}
