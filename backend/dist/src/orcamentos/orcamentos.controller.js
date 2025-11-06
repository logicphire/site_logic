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
exports.OrcamentosController = void 0;
const common_1 = require("@nestjs/common");
const orcamentos_service_1 = require("./orcamentos.service");
const create_orcamento_dto_1 = require("./dto/create-orcamento.dto");
const update_orcamento_status_dto_1 = require("./dto/update-orcamento-status.dto");
const send_email_orcamento_dto_1 = require("./dto/send-email-orcamento.dto");
let OrcamentosController = class OrcamentosController {
    orcamentosService;
    constructor(orcamentosService) {
        this.orcamentosService = orcamentosService;
    }
    create(createOrcamentoDto) {
        return this.orcamentosService.create(createOrcamentoDto);
    }
    findAll(status) {
        return this.orcamentosService.findAll(status);
    }
    getStats() {
        return this.orcamentosService.getStats();
    }
    findOne(id) {
        return this.orcamentosService.findOne(id);
    }
    updateStatus(id, updateStatusDto) {
        return this.orcamentosService.updateStatus(id, updateStatusDto);
    }
    sendEmail(id, sendEmailDto) {
        return this.orcamentosService.sendEmail(id, sendEmailDto);
    }
    remove(id) {
        return this.orcamentosService.remove(id);
    }
};
exports.OrcamentosController = OrcamentosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_orcamento_dto_1.CreateOrcamentoDto]),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_orcamento_status_dto_1.UpdateOrcamentoStatusDto]),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/send-email'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, send_email_orcamento_dto_1.SendEmailOrcamentoDto]),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrcamentosController.prototype, "remove", null);
exports.OrcamentosController = OrcamentosController = __decorate([
    (0, common_1.Controller)('orcamentos'),
    __metadata("design:paramtypes", [orcamentos_service_1.OrcamentosService])
], OrcamentosController);
//# sourceMappingURL=orcamentos.controller.js.map