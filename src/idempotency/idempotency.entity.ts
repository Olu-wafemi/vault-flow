import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";



@Entity()
export class IdempotencyRecord{
    @PrimaryGeneratedColumn('uuid')
    id: String;

    @Column({unique: true})
    key: string;

    @Column()
    walletId: string;

    @Column({type: 'varchar'})
    transactionType: string

    @Column()
    transactionId: string

    @Column({type: 'decimal', precision: 12, scale: 2, nullable:true})
    amount: number

    @CreateDateColumn()
    createdAt: Date;

}