import { NestFactory } from "@nestjs/core";
import { MessagePattern, MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TransactionHistoryModule } from "./transaction-history.module";


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(TransactionHistoryModule, {

        transport: Transport.TCP,
        options: {
            host: "localhost",
            port: 3003
        }

    })

    await app.listen()
    console.log(`Transaction Microservice is listening ${3003}`)
}
bootstrap()