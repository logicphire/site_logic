import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateOrcamentoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsString()
  @IsOptional()
  empresa?: string;

  @IsString()
  @IsNotEmpty()
  tipoServico: string;

  @IsString()
  @IsNotEmpty()
  prazo: string;

  @IsString()
  @IsOptional()
  diasPersonalizados?: string;

  @IsString()
  @IsOptional()
  dataInicio?: string;

  @IsString()
  @IsNotEmpty()
  orcamento: string;

  @IsString()
  @IsNotEmpty()
  descricaoProjeto: string;
}
