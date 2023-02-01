import { Module } from '@nestjs/common';
import { DeltaController } from './Delta.controller';
import { DeltaService } from './Delta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delta } from './Delta.model';


@Module({

  controllers: [DeltaController],
  providers: [DeltaService],
  imports: [
    TypeOrmModule.forFeature([Delta]),
  ],
  exports: [DeltaService],
})
export class DeltaModule {}
