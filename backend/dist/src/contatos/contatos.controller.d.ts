import { ContatosService } from './contatos.service';
import { CreateContatoDto } from './dto/create-contato.dto';
export declare class ContatosController {
    private readonly contatosService;
    constructor(contatosService: ContatosService);
    create(createContatoDto: CreateContatoDto): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        respondido: boolean;
        mensagem: string;
    }>;
    findAll(status?: string): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        respondido: boolean;
        mensagem: string;
    }[]>;
    getStats(): Promise<{
        total: number;
        novos: number;
        lidos: number;
        respondidos: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        respondido: boolean;
        mensagem: string;
    } | null>;
    markAsRead(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        respondido: boolean;
        mensagem: string;
    }>;
    markAsResponded(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        respondido: boolean;
        mensagem: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        telefone: string | null;
        status: string;
        respondido: boolean;
        mensagem: string;
    }>;
}
