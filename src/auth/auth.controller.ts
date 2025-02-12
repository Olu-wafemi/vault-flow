import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; 

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signup(@Body() body: {username: string; password: string}){
        const hashedpassword = this.authService.hashPassword(body.password)

        return {message: "User registered", hashedpassword};
    }

    @Post('login')
    async login(@Body() body: {username: string, password: string}){
        const userPassword = "1234"
        const comparepassword = this.authService.comparePasswords(userPassword, body.password)

        if(!comparepassword) return {message: "Invalid Credentials"}
        const token = this.authService.generateToken(body.username)
        return { message: "Login Successful", token}

    }

}
