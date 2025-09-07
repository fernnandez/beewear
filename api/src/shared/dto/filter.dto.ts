import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
} from 'class-validator';

export class BaseFilterDto {
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
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Data de início para filtro por data de criação',
    required: false,
  })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Data de fim para filtro por data de criação',
    required: false,
  })
  @IsOptional()
  endDate?: string;
}

export class ProductFilterDto extends BaseFilterDto {
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
  minPrice?: number;

  @ApiProperty({
    description: 'Filtrar por faixa de preço máxima',
    required: false,
  })
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Filtrar por cores',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiProperty({
    description: 'Filtrar por tamanhos',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];
}

export class OrderFilterDto extends BaseFilterDto {
  @ApiProperty({
    description: 'Filtrar por status do pedido',
    required: false,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  })
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status?: string;

  @ApiProperty({
    description: 'Filtrar por status do pagamento',
    required: false,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
  })
  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
  paymentStatus?: string;

  @ApiProperty({
    description: 'Filtrar por método de pagamento',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
