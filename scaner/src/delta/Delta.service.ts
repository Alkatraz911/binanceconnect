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


  async getOne(name: string) {
    return await this.DeltaRepository
      .createQueryBuilder('delta')
      .where('delta.name = :name', { name })
      .orderBy('id')
      .getMany();
  }

}
