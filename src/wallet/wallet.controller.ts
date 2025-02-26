import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import {MessagePattern, Payload} from "@nestjs/microservices"


@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService){}

    @MessagePattern({cmd: 'createWallet'})
    async createWallet(@Payload() data: {userId: string, curency: string}, ){
        return this.walletService.createWallet(data.userId, data.curency)
    }

    @MessagePattern({cmd: 'getWallets'})
    async getUserWallets(@Payload() data: { userId: string} ){
        return this.walletService.getWalletsByUser(data.userId);

    }

    @MessagePattern({cmd: "deposit"})
    async deposit(
        @Payload() data: {walletId: string, amount: number, idempotencyKey: string}
    ){
        return this.walletService.withdraw(data.walletId, data.amount, data.idempotencyKey);
        
    }

    @MessagePattern({cmd: "withdraw"})
    async withdrawal(
        @Payload() data: { walletId: string, amount: number, idempotencyKey: string}
    ){
        return await this.walletService.withdraw(data.walletId, data.amount,data.idempotencyKey)
    }
}
