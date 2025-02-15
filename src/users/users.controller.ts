import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {


    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req){
        return req.user
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get("all")
    getAllUsers(){

    }
}
