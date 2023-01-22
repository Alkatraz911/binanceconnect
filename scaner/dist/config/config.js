"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    PORT: process.env.PORT ? process.env.PORT : '3000',
    AUTH_MODE: process.env.AUTH_MODE === 'true',
    LOG_LEVEL: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
    POSTGRES_PORT: process.env.POSTGRES_PORT ? process.env.POSTGRES_PORT : '5432',
    POSTGRES_USER: process.env.POSTGRES_USER
        ? process.env.POSTGRES_USER
        : 'postgres',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD
        ? process.env.POSTGRES_PASSWORD
        : 'admin',
    POSTGRES_DB: process.env.POSTGRES_DB ? process.env.POSTGRES_DB : 'binancescaner',
    POSTGRES_HOST: process.env.POSTGRES_HOST
        ? process.env.POSTGRES_HOST
        : 'localhost',
    POSTGRES_CONTAINERPORT: process.env.POSTGRES_CONTAINERPORT
        ? process.env.POSTGRES_CONTAINERPORT
        : '5432',
    JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'default_salt',
};
exports.default = config;
//# sourceMappingURL=config.js.map