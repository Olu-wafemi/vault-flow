import { Controller, Get, Logger } from '@nestjs/common';
import { FraudDetectionService } from './fraud-detection.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('fraud-detection')
export class FraudDetectionController {
    private readonly logger = new Logger(FraudDetectionController.name);
    constructor(private readonly fraudDetectionService: FraudDetectionService){}

    @Get('status')
    getStatus(){
        return { status: 'Fraud Detection Service is running'}
    }

    @MessagePattern({topic: 'transaction_event'})
    async handleTransaction(@Payload() message: any){
        await this.fraudDetectionService.handleTransactionEvent(message.value)
        return {status: "Processed"}
    }
}
