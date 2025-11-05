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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    nome: createUserDto.nome,
                    password: createUserDto.password,
                    role: createUserDto.role || 'user',
                },
            });
            return {
                id: user.id,
                email: user.email,
                nome: user.nome,
                role: user.role,
                createdAt: user.createdAt,
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Email já cadastrado');
            }
            throw error;
        }
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            where: { ativo: true },
            orderBy: { createdAt: 'desc' },
        });
        return users.map(user => ({
            id: user.id,
            email: user.email,
            nome: user.nome,
            role: user.role,
            createdAt: user.createdAt,
        }));
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            nome: updatedUser.nome,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
        };
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        await this.prisma.user.update({
            where: { id },
            data: { ativo: false },
        });
        return { message: 'Usuário desativado com sucesso' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map