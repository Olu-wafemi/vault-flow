
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';

import { User } from '../users/user.entity';
import { forwardRef } from '@nestjs/common';



@Entity()
export class Wallet{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'decimal', precision: 12, scale:2, default:0})
    balance: number;

    @Column({type: "varchar"})
    currency: string


    @ManyToOne(()  => User)
    @JoinColumn({name: 'userId'})
    user: User;

    @Column()
    userId: number;

}