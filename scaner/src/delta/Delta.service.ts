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
      .createQueryBuilder('delta')
      .where('delta.coin = :name', { name })
      .orderBy('ts', "DESC").limit(60)
      .orderBy('ts', "ASC")
      .getMany();
    } else {
      let multiply = Number(tmfr.split('-')[0])
      return await this.DeltaRepository
      .createQueryBuilder('delta')
      .where('delta.coin = :name', { name })
      .orderBy('ts', "DESC").limit(60 * multiply)
      .orderBy('ts', "ASC")
      .getMany();
    }

  }

}
