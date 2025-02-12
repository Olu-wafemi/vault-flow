import { Injectable } from '@nestjs/common';
import { JwtService} from "@nestjs/jwt"
import * as bcryt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async hashPassword(password: string): Promise<string>{
        const salt = await bcryt.genSalt(10);
        return bcryt.hash(password, salt);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean>{
            const checkpassword =  bcryt.compare(password, hashedPassword);
            return checkpassword
    }

    async generateToken(userId: string): Promise<string>{
        return this.jwtService.sign({id: userId});
    }

}
