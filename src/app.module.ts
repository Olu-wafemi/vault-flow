import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { User } from './users/user.entity'; 
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { CurrencyService } from './currency/currency.service';
import { CurrencyModule } from './currency/currency.module';
import { FraudDetectionModule } from './fraud-detection/fraud-detection.module';

import { IdempotencyModule } from './idempotency/idempotency.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}) ,
    TypeOrmModule.forRoot({
      type:  'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true
      
    }),
    AuthModule,
    UsersModule,
    WalletModule,
    TransactionModule,
    CurrencyModule,
    FraudDetectionModule,
    IdempotencyModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, CurrencyService],
})
export class AppModule {}