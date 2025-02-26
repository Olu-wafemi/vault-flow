import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>, ){}



    async CreateUser(email: string, username: string, password: string ):Promise<User> {

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = this.userRepo.create({email, username, password: hashedPassword});
        return this.userRepo.save(user)

    }

    async findUserByUsername(username: string): Promise<User| null>{

        return this.userRepo.findOne({where: {username}})
    }

    async findOneById(userId: string){
        return this.userRepo.findOne({where: {id: userId}})
    }

    async updateRefreshToken(id: string, token: string){
        return this.userRepo.update(id,  {refreshToken: token})
    }
}
