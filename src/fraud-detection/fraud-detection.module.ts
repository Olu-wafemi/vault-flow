import { Module } from '@nestjs/common';
import { FraudDetectionService } from './fraud-detection.service';
import { FraudDetectionController } from './fraud-detection.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [FraudDetectionService],
    controllers: [FraudDetectionController]
})
export class FraudDetectionModule {}
