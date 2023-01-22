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
exports.AggTradesController = void 0;
const common_1 = require("@nestjs/common");
const aggTrades_service_1 = require("./aggTrades.service");
let AggTradesController = class AggTradesController {
    constructor(aggTradesService) {
        this.aggTradesService = aggTradesService;
    }
    getAll() {
        return this.aggTradesService.getAll();
    }
    getDelta(name, tmfr) {
        return this.aggTradesService.getDelta(name, tmfr);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AggTradesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':tmfr'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('tmfr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AggTradesController.prototype, "getDelta", null);
AggTradesController = __decorate([
    (0, common_1.Controller)('aggTrades/:name/'),
    __metadata("design:paramtypes", [aggTrades_service_1.AggTradesService])
], AggTradesController);
exports.AggTradesController = AggTradesController;
//# sourceMappingURL=aggTrades.controller.js.map