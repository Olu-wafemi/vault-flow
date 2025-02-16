import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"


@Entity()
export class Transaction{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true})
    fromWalletId: string

    @Column()
    toWalletId: string;

    @Column({type: 'decimal', precision: 12, scale: 2,})
    amount: number;

    @Column({nullable: true, unique: true})
    idempotencyKey?: string

    @CreateDateColumn()
    createdAt: Date

}