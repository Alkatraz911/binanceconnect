"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggTradesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const model_1 = require("./model");
let AggTradesService = class AggTradesService {
    constructor(aggTradeRepository) {
        this.aggTradeRepository = aggTradeRepository;
    }
    async getAll() {
        return await this.aggTradeRepository.createQueryBuilder().getMany();
    }
    async getOne(name) {
        return await this.aggTradeRepository
            .createQueryBuilder('agg_trades')
            .where('agg_trades.name = :name', { name })
            .orderBy('id')
            .getMany();
    }
    async getDelta(name, tmfr) {
        let availabletmft = ['1H', '4H', '12H', '1D', '1W'];
        if (!availabletmft.includes(tmfr.toLocaleUpperCase())) {
            return;
        }
        else {
            let result = await this.getOne(name);
            let marketBuy = 0;
            let limitBuy = 0;
            let timecounter = -1;
            let deltaArr = [];
            const countDelta = (isMarket, quantity) => {
                isMarket ? (marketBuy += quantity) : (limitBuy += quantity);
            };
            const checkTime = (_tmfr, time, isMarket, quantity) => {
                if (timecounter === -1) {
                    timecounter = new Date(time).getHours();
                    countDelta(isMarket, quantity);
                }
                else {
                    if (timecounter === new Date(time).getHours()) {
                        countDelta(isMarket, quantity);
                    }
                    else {
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
                checkTime('', Number(el.timeMachine), el.isBuyer, Number(el.quantity));
            });
            return (deltaArr);
        }
    }
};
AggTradesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(model_1.AggTrade)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AggTradesService);
exports.AggTradesService = AggTradesService;
//# sourceMappingURL=aggTrades.service.js.map