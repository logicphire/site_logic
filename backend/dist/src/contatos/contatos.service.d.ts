import { PrismaService } from '../prisma/prisma.service';
import { CreateContatoDto } from './dto/create-contato.dto';
export declare class ContatosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContatoDto: CreateContatoDto): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        mensagem: string;
        respondido: boolean;
    }>;
    findAll(status?: string): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        mensagem: string;
        respondido: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        mensagem: string;
        respondido: boolean;
    } | null>;
    markAsRead(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        mensagem: string;
        respondido: boolean;
    }>;
    markAsResponded(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        mensagem: string;
        respondido: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        mensagem: string;
        respondido: boolean;
    }>;
    getStats(): Promise<{
        total: number;
        novos: number;
        lidos: number;
        respondidos: number;
    }>;
}
