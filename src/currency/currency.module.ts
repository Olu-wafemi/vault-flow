import { Module } from '@nestjs/common';
import {HttpModule} from "@nestjs/axios"
import { CurrencyService } from './currency.service';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
    imports: [ HttpModule.register({
        timeout: 5000,
        maxRedirects: 5
    }), CacheModule.register({
        ttl: 60,
        isGlobal: true
    })],
    providers: [CurrencyService],
    exports: [CurrencyService]
})
export class CurrencyModule {}
