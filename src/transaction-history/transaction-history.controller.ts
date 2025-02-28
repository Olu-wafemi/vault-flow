import { Controller, Query, Get } from "@nestjs/common";
import { TransactionHistoryService } from "./transaction-history.service";




@Controller()
export class TransactionHistoryController{
    constructor(private readonly transactionHistoryService: TransactionHistoryService){}

    @Get()
    async getTransactions(@Query('userId')  userId: string){
        return await this.transactionHistoryService.getTransactionsByUser(userId)
    }

}