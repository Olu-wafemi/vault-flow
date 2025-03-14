import { Controller, Logger } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transaction-history')
export class TransactionHistoryKafkaController {
    private readonly logger = new Logger(TransactionHistoryKafkaController.name)

    constructor(private transactionHistoryService: TransactionHistoryService){}

    @MessagePattern({ topic: "transaction_event" })
    async handleTransactionEvent(@Payload() message: any){
        this.logger.log(`Received transaction event": ${JSON.stringify(message.value)}`)
        await this.transactionHistoryService.createTransaction(message.value)
        return {status: "Event Processed"}


    }
}
