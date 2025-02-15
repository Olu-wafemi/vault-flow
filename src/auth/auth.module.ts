import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';


@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(ConfigService: ConfigService)=>({
        secret: ConfigService.get<string>("JWT_SECRET"),
        signOptions: {expiresIn: '1h'}

      })
    })
  ],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
  controllers: [AuthController],
  
})
export class AuthModule {}
