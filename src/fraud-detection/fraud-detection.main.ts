import { NestFactory } from "@nestjs/core";

import { FraudDetectionModule } from "./fraud-detection.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(FraudDetectionModule,{
        transport: Transport.KAFKA,
        options:{
            client:{
                clientId: 'fraud-detection',
                brokers: ['localhost:9092']
            },
            consumer:{
                groupId: 'fraud-detection-group'
            }
        }
    })

    await app.listen()

    console.log("Fraud Detection Microservice is running on Kafka..")

    
}

bootstrap()