import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyRecord } from './idempotency.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IdempotencyRecord])],
    
})
export class IdempotencyModule {}
