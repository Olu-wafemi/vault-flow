import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService){}

    @Post()
    async createWallet(@Body() body: {cuurency: string}, @Req() req){
        return this.walletService.createWallet(req.user.id, body.cuurency)
    }

    @Get()
    async getUserWallets(@Req() req){
        return this.walletService.getWalletsByUser(req.user.id);

    }

    @Post(":id/depost")
    async deposit(
        @Param('id') walletId: string,
        @Body() body: { amount: number, idempotencyKey: string}
    ){
        return this.walletService.withdraw(walletId, body.amount, body.idempotencyKey);
        
    }
}
