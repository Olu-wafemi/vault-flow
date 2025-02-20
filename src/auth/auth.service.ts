import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService} from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) {}

    async validateUser(username: string, password: string){
        const user = await this.userService.findUserByUsername(username)
        if(user && (await bcrypt.compare(user.password, password))){
            return user;
        }

        throw new UnauthorizedException('Invalid Credentials')
    }

    async signup(username: string, password: string){

        const check_user = await this.userService.findUserByUsername(username)
        if(!check_user){
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await this.userService.CreateUser(username, hashedPassword)
            return { message: "Signup Successful", ...user}
        }
        throw new UnauthorizedException()

    }
    async login(body: any){
        const payload = {password: body.password, username: body.username}

        const validate_user = await this.validateUser(payload.username, payload.password)
        const accessToken = this.jwtService.sign(payload, {expiresIn: '15m'})
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '7d'})

        const hashedRefreshToken = await bcrypt.hash(refreshToken,10);
        await this.userService.updateRefreshToken(validate_user.id, hashedRefreshToken);
        return {accessToken, refreshToken}
    }

    async refreshToken(userId: string, refreshToken: string){
        const user = await this.userService.findOneById(userId)
        if(!user || !user.refreshToken) throw new UnauthorizedException();

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken)
        if(!isValid) throw new UnauthorizedException()

            const payload = { sub: user.id, username: user.username}

            const newAccessToken = this.jwtService.sign(payload, {expiresIn: '15m'})

            return {accessToken: newAccessToken}
    }

    async logout( userId: string){
        await this.userService.updateRefreshToken(userId, "")
    }

}
