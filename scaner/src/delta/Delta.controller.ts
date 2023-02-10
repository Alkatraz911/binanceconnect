import { Controller, Get, Param } from '@nestjs/common';
import { DeltaService } from './Delta.service';

@Controller('delta/:name/:tmfr')
export class DeltaController {
  constructor(private readonly DeltaService: DeltaService) {}

  @Get()
  getCoin(@Param('name') name: string, @Param('tmfr') tmfr: string) {
    return this.DeltaService.getOne(name, tmfr);
  }

}
