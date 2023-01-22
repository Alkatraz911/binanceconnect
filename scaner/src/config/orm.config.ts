import { DataSourceOptions } from 'typeorm';
import { AggTrade } from '../aggTrades/model';
import config from './config';
import * as path from 'path';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: Number(config.POSTGRES_PORT),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  entities: [AggTrade],
  synchronize: false,
  dropSchema: false,
  migrations: [path.join(__dirname, '/../../migrations') + '/*.ts']
};

export default ormConfig;
