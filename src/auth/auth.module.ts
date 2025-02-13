import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


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
  providers: [AuthService],
  controllers: [AuthController],
  
})
export class AuthModule {}
