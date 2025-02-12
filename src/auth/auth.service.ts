import { Injectable } from '@nestjs/common';
import { JwtService} from "@nestjs/jwt"
import * as bcryt from "bcrypt"
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) {}

    async signup(username: string, password: string){
        return this.userService.CreateUser(username, password)
    }
    async login(username: string, password: string){
        const user = await  this.userService.findUserByUsername(username)
        if(!user) return {message: "User not found"}

        const isPasswordValid = await bcryt.compare(password, user.password);
        if(!isPasswordValid) return { message: "Invalid Credentials"}

        const token = this.jwtService.sign({id: user.id})
        return {message : "Login successful", token}
    }
   

}
