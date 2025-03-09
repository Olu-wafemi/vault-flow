import { NestFactory } from "@nestjs/core";
import { MessagePattern, MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TransactionHistoryModule } from "./transaction-history.module";


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(TransactionHistoryModule, {

        transport: Transport.TCP,
        options: {
            host: "localhost",
            port: parseInt(process.env.TX_PORT!)
        }

    })

    await app.listen()
    console.log(`Transaction Microservice is listening ${process.env.TX_PORT!}`)
}
bootstrap()