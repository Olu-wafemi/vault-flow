import { Module } from '@nestjs/common';

import {CacheModule} from "@nestjs/cache-manager"
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';
import { DataSource, Repository } from 'typeorm';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';

@Module({
  imports: [CacheModule.register({
    ttl: 60,
    isGlobal: true

  }),
  TypeOrmModule.forFeature([Wallet, IdempotencyRecord]), IdempotencyModule]
  , 
  
  providers: [WalletService, Repository],
  controllers: [WalletController],
  exports: [WalletService]

})
export class WalletModule {}
