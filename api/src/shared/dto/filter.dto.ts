import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

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
}

export class ProductFilterDto extends BaseFilterDto {
  @ApiProperty({
    description: 'Filtrar por coleção (publicId)',
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionId?: string;
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
