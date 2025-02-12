import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>, private readonly authService: AuthService){}



    async CreateUser(username: string, password: string ):Promise<User> {

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = this.userRepo.create({username, password: hashedPassword});
        return this.userRepo.save(user)

    }

    async findUserByUsername(username: string): Promise<User| null>{

        return this.userRepo.findOne({where: {username}})
    }
}
