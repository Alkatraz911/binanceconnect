import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delta } from './Delta.model';

@Injectable()
export class DeltaService {
  constructor(
    @InjectRepository(Delta)
    private DeltaRepository: Repository<Delta>,
  ) {}


  async getOne(name: string, tmfr: string) {
    if(tmfr === '1-H') {
      return await this.DeltaRepository
      .createQueryBuilder('delta').limit(72)
      .where('delta.coin = :name', { name })
      .orderBy('id')
      .getMany();
    } else {
      let multiply = Number(tmfr.split('-')[0])
      return await this.DeltaRepository
      .createQueryBuilder('delta').limit(72*multiply)
      .where('delta.coin = :name', { name })
      .orderBy('id')
      .getMany();
    }

  }

}
