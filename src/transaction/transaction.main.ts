import { NestFactory } from "@nestjs/core";
import { MessagePattern, MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TransactionModule } from './transaction.module';


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(TransactionModule, {

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