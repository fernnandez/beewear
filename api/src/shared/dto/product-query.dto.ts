import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  Max,
  Min,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class ProductQueryDto {
  // Parâmetros de paginação
  @ApiProperty({
    description: 'Número da página (começando em 1)',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Número de itens por página',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Filtros de produto
  @ApiProperty({
    description: 'Termo de busca geral',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtrar apenas itens ativos',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Filtrar por coleção (publicId)',
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionId?: string;

  @ApiProperty({
    description: 'Filtrar por faixa de preço mínima',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({
    description: 'Filtrar por faixa de preço máxima',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    description: 'Filtrar por cores (separadas por vírgula)',
    required: false,
  })
  @IsOptional()
  @IsString()
  colors?: string;

  @ApiProperty({
    description: 'Filtrar por tamanhos (separados por vírgula)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sizes?: string;

  @ApiProperty({
    description: 'Data de início para filtro por data de criação',
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: 'Data de fim para filtro por data de criação',
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}
