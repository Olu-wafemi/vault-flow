import { Wallet } from "src/wallet/wallet.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";


export enum UserRole{
    ADMIN = "admin",
    USER = "user"
}
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string

    @Column({nullable: true})
    refreshToken: string

    // @OneToMany(() => Wallet)
    // wallet: Wallet

    @Column({type: "enum", enum: UserRole, default: UserRole.USER})
    roles: UserRole;
}