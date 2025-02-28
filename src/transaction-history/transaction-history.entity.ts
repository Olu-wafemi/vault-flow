import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";





@Entity()
export class TransactionHistory{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string

    @Column()
    type: string

    @Column()
    amount: number

    @Column({nullable: true})
    fromWalletId? :string;

    @Column({nullable: true})
    toWalletId? : string;

    @Column()
    timestamp:  Date


}