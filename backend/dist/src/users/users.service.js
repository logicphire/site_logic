"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    nome: createUserDto.nome,
                    password: hashedPassword,
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
        const dataToUpdate = { ...updateUserDto };
        if (updateUserDto.password) {
            dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dataToUpdate,
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