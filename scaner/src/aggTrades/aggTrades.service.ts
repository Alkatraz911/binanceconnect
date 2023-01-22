import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggTrade } from './model';

@Injectable()
export class AggTradesService {
  constructor(
    @InjectRepository(AggTrade)
    private aggTradeRepository: Repository<AggTrade>,
  ) {}

  async getAll() {
    return await this.aggTradeRepository.createQueryBuilder().getMany();
  }

  async getOne(name: string) {
    return await this.aggTradeRepository
      .createQueryBuilder('agg_trades')
      .where('agg_trades.name = :name', { name })
      .orderBy('id')
      .getMany();
  }

  async getDelta(name: string, tmfr: string) {
    let availabletmft = ['1H', '4H', '12H', '1D', '1W'];

    if (!availabletmft.includes(tmfr.toLocaleUpperCase())) {
      return;
    } else {
      let result = await this.getOne(name);
      let marketBuy = 0;
      let limitBuy = 0;
      let timecounter = -1;
      let deltaArr = [];

      const countDelta = (isMarket, quantity) => {
        isMarket ? (marketBuy += quantity) : (limitBuy += quantity);
      };

      const checkTime = (_tmfr, time:number, isMarket, quantity) => {


        if (timecounter === -1) {
          timecounter = new Date(time).getHours();
          countDelta(isMarket, quantity);
        } else {
          if (timecounter === new Date(time).getHours()) {
            countDelta(isMarket, quantity);
          } else {
            deltaArr.push({
              label: `${new Date(time).toDateString()} ${timecounter}`,
              delta: marketBuy - limitBuy,
            });
            marketBuy = 0;
            limitBuy = 0;
            timecounter = -1;
          }
        }
      };
      result.forEach((el) => {
         checkTime('', Number(el.timeMachine), el.isBuyer, Number(el.quantity))
      });
      return(deltaArr)
    }
  }
}
