import { OrcamentosService } from './orcamentos.service';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoStatusDto } from './dto/update-orcamento-status.dto';
export declare class OrcamentosController {
    private readonly orcamentosService;
    constructor(orcamentosService: OrcamentosService);
    create(createOrcamentoDto: CreateOrcamentoDto): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        orcamento: string;
        telefone: string;
        empresa: string | null;
        tipoServico: string;
        prazo: string;
        descricaoProjeto: string;
        status: string;
        notasInternas: string | null;
    }>;
    findAll(status?: string): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        orcamento: string;
        telefone: string;
        empresa: string | null;
        tipoServico: string;
        prazo: string;
        descricaoProjeto: string;
        status: string;
        notasInternas: string | null;
    }[]>;
    getStats(): Promise<{
        total: number;
        pendentes: number;
        emAnalise: number;
        respondidos: number;
        fechados: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        orcamento: string;
        telefone: string;
        empresa: string | null;
        tipoServico: string;
        prazo: string;
        descricaoProjeto: string;
        status: string;
        notasInternas: string | null;
    } | null>;
    updateStatus(id: number, updateStatusDto: UpdateOrcamentoStatusDto): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        orcamento: string;
        telefone: string;
        empresa: string | null;
        tipoServico: string;
        prazo: string;
        descricaoProjeto: string;
        status: string;
        notasInternas: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        orcamento: string;
        telefone: string;
        empresa: string | null;
        tipoServico: string;
        prazo: string;
        descricaoProjeto: string;
        status: string;
        notasInternas: string | null;
    }>;
}
