import { NestFactory } from "@nestjs/core";
import { MessagePattern, MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TransactionModule } from './transaction.module';


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(TransactionModule, {

        transport: Transport.TCP,
        options: {
            host: "0.0.0.0",
            port: 30002,
        }

    })

    await app.listen()
    console.log("Transaction Microservice is listening")
}
bootstrap()