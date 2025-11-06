import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailOrcamentoDto {
  @IsNotEmpty()
  @IsString()
  assunto: string;

  @IsNotEmpty()
  @IsString()
  mensagem: string;

  @IsOptional()
  @IsString()
  valorOrcamento?: string;

  @IsOptional()
  @IsString()
  prazoEntrega?: string;
}
