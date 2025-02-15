import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


export enum UserRole{
    ADMIN = "admin",
    USER = "user"
}
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string

    @Column({nullable: true})
    refreshToken: string

    @Column({type: "enum", enum: UserRole, default: UserRole.USER})
    roles: UserRole;
}