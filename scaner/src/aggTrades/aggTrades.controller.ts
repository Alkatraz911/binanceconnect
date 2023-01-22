import { Controller, Get, Param } from '@nestjs/common';
import { AggTradesService } from './aggTrades.service';

@Controller('aggTrades/:name/')
export class AggTradesController {
  constructor(private readonly aggTradesService: AggTradesService) {}

  @Get()
  getAll() {
    return this.aggTradesService.getAll();
  }

  @Get(':tmfr')
  getDelta(@Param('name') name: string, @Param('tmfr') tmfr: string) {
    return this.aggTradesService.getDelta(name, tmfr);
  }
}
