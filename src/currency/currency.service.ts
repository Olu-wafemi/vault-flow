import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from "@nestjs/axios"
import {CACHE_MANAGER, Cache} from "@nestjs/cache-manager"
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER ) private cacheManager: Cache



    ){}



    async getExchangerates(){
        let getrates: any

        const checkrates = this.cacheManager.get("rates")
        if(!checkrates){
            getrates = this.httpService.get("https://api.fastforex.io/fetch-all?api_key=7df3b391e3-7a16ec8337-srvrnn")
            const response = await lastValueFrom(getrates)
            this.cacheManager.set("rates", response)
        }
        return getrates

    }

    async convertCurrency(from: string, amount: number, to: string){

        const convert = this.httpService.get(`https://api.fastforex.io/convert?from=${from}&to=${to}&amount=${amount}&api_key=7df3b391e3-7a16ec8337-srvrnn`)
        const response = await  lastValueFrom(convert)
        return response.data.result.to
    }

    
}
