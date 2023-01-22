"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggTradesModule = void 0;
const common_1 = require("@nestjs/common");
const aggTrades_controller_1 = require("./aggTrades.controller");
const aggTrades_service_1 = require("./aggTrades.service");
const typeorm_1 = require("@nestjs/typeorm");
const model_1 = require("./model");
let AggTradesModule = class AggTradesModule {
};
AggTradesModule = __decorate([
    (0, common_1.Module)({
        controllers: [aggTrades_controller_1.AggTradesController],
        providers: [aggTrades_service_1.AggTradesService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([model_1.AggTrade]),
        ],
        exports: [aggTrades_service_1.AggTradesService],
    })
], AggTradesModule);
exports.AggTradesModule = AggTradesModule;
//# sourceMappingURL=aggTrades.module.js.map