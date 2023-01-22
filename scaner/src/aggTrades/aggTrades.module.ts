import { Module } from '@nestjs/common';
import { AggTradesController } from './aggTrades.controller';
import { AggTradesService } from './aggTrades.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggTrade } from './model';


@Module({

  controllers: [AggTradesController],
  providers: [AggTradesService],
  imports: [
    TypeOrmModule.forFeature([AggTrade]),
  ],
  exports: [AggTradesService],
})
export class AggTradesModule {}
