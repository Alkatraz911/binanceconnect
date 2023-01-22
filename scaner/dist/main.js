"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const platform_fastify_1 = require("@nestjs/platform-fastify");
require("reflect-metadata");
async function bootstrap() {
    let app;
    let mode;
    if (process.env.USE_FASTIFY === 'true') {
        mode = 'fastify';
        app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    }
    else {
        mode = 'express';
        app = await core_1.NestFactory.create(app_module_1.AppModule);
    }
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    await app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`App is running at ${process.env.PORT} port. App mode ${mode}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map