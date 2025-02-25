import {Controller, Post, Get, Body, Query} from "@nestjs/common"
import { ClientProxy, ClientProxyFactory,Transport } from "@nestjs/microservices"
import { lastValueFrom } from "rxjs"

@Controller('wallet')
export class GatewayController{
    private client: ClientProxy
    constructor(){
        this.client = ClientProxyFactory.create({
            transport: Transport.TCP,
            options:{
                host: "0.0.0.0",
                port: 3001
            }
        })
    }

    @Post()
    async createWallet(@Body() body:{userId: number, currency: string}){
        const pattern = {cmd : 'createWallet'}
        const payload = {userId: body.userId, curency: body.currency};

        const result = await lastValueFrom(this.client.send(pattern, payload));
        return result
    } 
    @Get()
    async getWallets(@Query("userId") userId: number){
        const pattern = {cmd: "getWallets"}
        const payload = {userId: Number(userId)};
        const result = await lastValueFrom(this.client.send(pattern, payload))
        return result;
    }

}