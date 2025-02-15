import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, IdempotencyRecord])],
  providers: [WalletService],
  controllers: [WalletController]
})
export class WalletModule {}
