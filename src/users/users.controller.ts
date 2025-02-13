import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {


    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req){
        return req.user
    }
}
