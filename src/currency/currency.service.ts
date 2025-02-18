import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios"
@Injectable()
export class CurrencyService {
    constructor(private readonly httpService: HttpService){}



    async getExchangerates(){
        return this.httpService.get('http://data.fixer.io/api/latest?access_key = 084c873345ec3e62114827897b8f5a51')
    }

    
}
