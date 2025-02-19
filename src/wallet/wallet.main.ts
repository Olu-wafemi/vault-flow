import { MessagePattern } from "@nestjs/microservices";
import {NestFactory} from "@nestjs/core"
import {Transport, MicroserviceOptions} from "@nestjs/microservices"
import { WalletModule } from "./wallet.module";

async function bootstrap(){

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(WalletModule,{

    transport: Transport.TCP,
    options:{
        host: '0.0.0.0',
        port: 3001
    }
})

 await app.listen()
}
bootstrap()