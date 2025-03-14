import { NestFactory } from "@nestjs/core";
import { MessagePattern, MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TransactionHistoryModule } from "./transaction-history.module";
import { AllExceptionFilter } from "src/exception";


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(TransactionHistoryModule, {

        transport: Transport.KAFKA, 
        options: {
          client: {
            clientId: 'transaction-history-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-history-group',
          },
        },
      });
    app.useGlobalFilters(new AllExceptionFilter())

    await app.listen()
    console.log(`Transaction History Microservice is listening on Kafka`)

    
}
bootstrap()