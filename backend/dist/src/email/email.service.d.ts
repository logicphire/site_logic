export declare class EmailService {
    private transporter;
    constructor();
    enviarEmailNovoOrcamento(dados: {
        nome: string;
        email: string;
        telefone: string;
        empresa?: string;
        tipoServico: string;
        prazo: string;
        diasPersonalizados?: string;
        dataInicio?: string;
        orcamento: string;
        descricaoProjeto: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    private formatarTipoServico;
    private formatarOrcamento;
    private formatarPrazo;
}
