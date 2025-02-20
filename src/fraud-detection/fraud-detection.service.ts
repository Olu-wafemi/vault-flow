import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { response } from 'express';
import { lastValueFrom } from 'rxjs';

interface TransactionEvent{
    transactionId: string;
    Amount: number;
    Time: number
}


@Injectable()
export class FraudDetectionService {
    
    private readonly logger = new Logger(FraudDetectionService.name)
    private readonly fraudThreshold = 0.7;

    constructor(private readonly httpService: HttpService,){}

    private extractHour(timeInSeconds: number): number{

        
        return Math.floor((timeInSeconds % 86400)/ 3600)
    }

    async predictFraudFromModel(transcation: TransactionEvent): Promise<number>{
        
        const payload = {
            Amount: transcation.Amount,
            Hour: this.extractHour(transcation.Time)
        }

        try{

            const send_request = this.httpService.post('http://localhost:5000/predict', payload)
            const response = await lastValueFrom(send_request)

            this.logger.log(`Prediction response for transaction ${transcation.transactionId}`)

            const probability = response.data.probability
            return probability[1]
9
        }
        catch(error){
            this.logger.error("Error calling prediction service", error)
            return 0
        }
        
    }

    async handleTransactionEvent(transaction: TransactionEvent): Promise<void>{
        this.logger.log(`Proceesing transaction: ${transaction.transactionId}`);
        const fraudProbability = await this.predictFraudFromModel(transaction)
        this.logger.log(`Fraud Probabilty for transaction ${transaction.transactionId}: ${fraudProbability.toFixed(2)}`)

        if(fraudProbability >= this.fraudThreshold){
            this.logger.warn(`Transaction ${transaction.transactionId} flagged as suspicious`)

        }else{
            this.logger.log(`Transaction ${transaction.transactionId} appears normal`)
        }
    }

    
}
