import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { JwtAuthGuard } from './guards/jwt-auth.guard';
//import { AuthGuard } from './auth.guard';

import { AuthGuard } from '@nestjs/passport';


@Controller({
    version: "1",
    path: 'auth'
})
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signup(@Body() body: {email : string,username: string; password: string}){
        return this.authService.signup(body.email, body.username, body.password)
        
    }

    @Post('login')
    async login(@Body() body: {email: string, password: string}){
       return this.authService.login(body)

    }

    @UseGuards(AuthGuard('google'))
    @Get('google')
    googleLogin(){

    }

    @UseGuards(AuthGuard('google'))
    @Get('google/callback')
    async googleCallback(@Req() req){
       // return this.authService.googleCallback(req.user);
    }

    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken:string, @Req() req){
        return this.authService.refreshToken(req.user.id, refreshToken)
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req){
        await this.authService.logout(req.user.id);
        return { message: "Logged out Successfully"}
    }

}
