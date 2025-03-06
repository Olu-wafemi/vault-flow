import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }


    @MessagePattern({ cmd: "transfer" })
    async transferFunds(
        @Payload() data: { fromWalletId: string, toWalletId: string, amount: number, idempotencyKey: string }
    ) {
        return await this.transactionService.transferfunds(
            data.toWalletId, data.toWalletId, data.amount, data.idempotencyKey
        )
    }
}
