import { Controller, Get, Param } from '@nestjs/common';
import { DeltaService } from './Delta.service';

@Controller('delta/:name/')
export class DeltaController {
  constructor(private readonly DeltaService: DeltaService) {}

  @Get()
  getCoin(@Param('name') name: string) {
    return this.DeltaService.getOne(name);
  }

}
