import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

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
  @IsString()
  active?: string;

  @ApiProperty({
    description: 'Filtrar por coleção (publicId)',
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionId?: string;

  @ApiProperty({
    description: 'Campo para ordenação',
    enum: ['name', 'createdAt', 'updatedAt', 'price'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Direção da ordenação',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}
