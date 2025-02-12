import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { User } from './users/user.entity'; 
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}) ,
    TypeOrmModule.forRoot({
      type:  'postgres',
      url: process.env.DATABASE_URL,
      entities: [User],
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
