import { MessagePattern } from "@nestjs/microservices";
import {NestFactory} from "@nestjs/core"
import {Transport, MicroserviceOptions} from "@nestjs/microservices"
import { WalletModule } from "./wallet.module";

async function bootstrap(){

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(WalletModule,{

    transport: Transport.TCP,
    options:{
        host: 'localhost',
        port: 3001
    }
})

 await app.listen()
 console.log("Wallet Microservice is listening")
}
bootstrap()