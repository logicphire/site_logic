import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  plataforma: string;

  @IsString()
  @IsOptional()
  imagem?: string;

  @IsArray()
  @IsString({ each: true })
  tecnologias: string[];

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  tipoLink?: string;

  @IsString()
  @IsOptional()
  repositorio?: string;

  @IsBoolean()
  @IsOptional()
  destaque?: boolean;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsNumber()
  @IsOptional()
  ordem?: number;
}
