import { Controller, Post, Get, Body, Query } from "@nestjs/common"
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices"
import { lastValueFrom } from "rxjs"
import { Wallet } from 'src/wallet/wallet.entity';

@Controller()
export class GatewayController {
    private walletClient: ClientProxy;
    private transactionClient: ClientProxy
    constructor() {
        this.walletClient = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
                host: "localhost",
                port: 3001
            }
        })

        this.transactionClient = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
                host: "localhost",
                port: parseInt(process.env.TX_PORT!),
            }
        })
    }

    @Post('wallet')
    async createWallet(@Body() body: { userId: number, currency: string }) {
        const pattern = { cmd: 'createWallet' }
        const payload = { userId: body.userId, curency: body.currency };

        const result = await lastValueFrom(this.walletClient.send(pattern, payload));
        return result
    }
    @Get('wallet')
    async getWallets(@Query("userId") userId: number) {
        const pattern = { cmd: "getWallets" }
        const payload = { userId: Number(userId) };
        const result = await lastValueFrom(this.walletClient.send(pattern, payload))
        return result;
    }
    @Post('wallet/deposit')
    async deposit(@Body() body: { walletId: string; amount: number; idempotencyKey: string }) {
        const pattern = { cmd: 'deposit' }
        const payload = {
            walletId: body.walletId,
            amount: body.amount,
            idempotencyKey: body.idempotencyKey
        }
        const result = await lastValueFrom(this.walletClient.send(pattern, payload))
        return result;
    }
    @Post('wallet/withdraw')
    async withdrawalsSchema(@Body() body: { walletId: string; amount: number; idempotencyKey: string }) {
        const payload = {
            walletId: body.walletId,
            amount: body.amount,
            idempotencyKey: body.idempotencyKey
        }
        const pattern = { cmd: "withdraw" }

        const result = await lastValueFrom(this.walletClient.send(pattern, payload))
        return result
    }

    @Post('transaction/transfer')
    async transfer(
        @Body() body: { fromWalletId: string; toWalletId: string; amount: number; idempotencyKey: string; }
    ) {
        const pattern = { cmd: "transfer" }
        const payload = {
            fromWalletId: body.fromWalletId,
            toWalletId: body.toWalletId,
            amount: body.amount,
            idempotencyKey: body.idempotencyKey
        }

        const result = await lastValueFrom(this.transactionClient.send(pattern, payload))

    }



}
