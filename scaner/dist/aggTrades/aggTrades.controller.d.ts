import { AggTradesService } from './aggTrades.service';
export declare class AggTradesController {
    private readonly aggTradesService;
    constructor(aggTradesService: AggTradesService);
    getAll(): Promise<import("./model").AggTrade[]>;
    getDelta(name: string, tmfr: string): Promise<any[]>;
}
