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
    let availabletmft = ['1-H', '4-H', '12-H', '24-H', '168-H'];

    if (!availabletmft.includes(tmfr.toLocaleUpperCase())) {
      return {status:400, text: 'bad request'};
    } else  {

      let result = await this.getOne(name);
      let marketBuy = 0;
      let limitBuy = 0;
      let timecounter = 100;
      let deltaArr:object[] = [];

      const countDelta = (isMarket, quantity) => {
        isMarket ? (marketBuy += quantity) : (limitBuy += quantity);
      };

      result.forEach((el, index) => {
        let ts = Number(el.timeMachine)
        if (timecounter === 100) {
          timecounter = new Date(ts).getHours();
          countDelta(el.isBuyer, Number(el.quantity));
        } else {
          if (timecounter === new Date(ts).getHours()) {
            countDelta(el.isBuyer, Number(el.quantity));
          } else {
            deltaArr.push({
              label: `${new Date(Number(result[index-1].timeMachine)).toDateString()} ${new Date(Number(result[index-1].timeMachine)).getHours()}H`,
              delta: marketBuy - limitBuy,
              hour:  timecounter
            });
            marketBuy = 0;
            limitBuy = 0;
            timecounter = 100;
          }
        }
      });
      
      const tmfrChange = (tmfr, arr) => {
        
          let newDelta = 0
          let result:object[] = []

          arr.forEach((el) => {
            let {label, delta, hour} = el;
            if(hour % tmfr === 0) {
              delta = newDelta;
              result.push({label, delta, hour})
              newDelta = 0
            } else {
              newDelta += delta
            }
          });
          return result
      }
      if (tmfr==='1-H') {
        return deltaArr
      } else {
        return tmfrChange(Number(tmfr.split('-')[0]), deltaArr);
      }
      
    } 
  }
}
