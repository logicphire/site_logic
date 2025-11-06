export declare class CreateProjectDto {
    titulo: string;
    descricao: string;
    categoria: string;
    tipo: string;
    plataforma: string;
    imagem?: string;
    tecnologias: string[];
    link?: string;
    tipoLink?: string;
    repositorio?: string;
    destaque?: boolean;
    ativo?: boolean;
    ordem?: number;
}
