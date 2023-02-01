"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../aggTrades/model");
const Delta_model_1 = require("../delta/Delta.model");
const config_1 = require("./config");
const path = require("path");
const ormConfig = {
    type: 'postgres',
    host: config_1.default.POSTGRES_HOST,
    port: Number(config_1.default.POSTGRES_PORT),
    username: config_1.default.POSTGRES_USER,
    password: config_1.default.POSTGRES_PASSWORD,
    database: config_1.default.POSTGRES_DB,
    entities: [model_1.AggTrade, Delta_model_1.Delta],
    synchronize: false,
    dropSchema: false,
    migrations: [path.join(__dirname, '/../../migrations') + '/*.ts']
};
exports.default = ormConfig;
//# sourceMappingURL=orm.config.js.map