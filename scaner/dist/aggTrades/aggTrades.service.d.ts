import { Repository } from 'typeorm';
import { AggTrade } from './model';
export declare class AggTradesService {
    private aggTradeRepository;
    constructor(aggTradeRepository: Repository<AggTrade>);
    getAll(): Promise<AggTrade[]>;
    getOne(name: string): Promise<AggTrade[]>;
    getDelta(name: string, tmfr: string): Promise<object[] | {
        status: number;
        text: string;
    }>;
}
