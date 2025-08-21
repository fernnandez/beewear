import { ApiProperty } from '@nestjs/swagger';
import { CollectionSummaryDto } from './product-list-response.dto';

export class ProductVariationSizeDetailsDto {
  @ApiProperty({ description: 'Tamanho do produto' })
  size: string;

  @ApiProperty({ description: 'Informações de estoque' })
  stock: {
    quantity: number;
  };
}

export class ProductVariationDetailsDto {
  @ApiProperty({ description: 'PublicId da variação' })
  publicId: string;

  @ApiProperty({ description: 'Cor da variação' })
  color: string;

  @ApiProperty({ description: 'Nome da variação' })
  name: string;

  @ApiProperty({ description: 'Preço da variação' })
  price: number;

  @ApiProperty({ description: 'Lista de imagens da variação' })
  images: string[];

  @ApiProperty({ description: 'Tamanhos disponíveis' })
  sizes: ProductVariationSizeDetailsDto[];
}

export class ProductDetailsResponseDto {
  @ApiProperty({ description: 'PublicId do produto' })
  publicId: string;

  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @ApiProperty({ description: 'Status ativo do produto' })
  active: boolean;

  @ApiProperty({ description: 'Coleção do produto', required: false })
  collection?: CollectionSummaryDto;

  @ApiProperty({ description: 'Variações do produto' })
  variations: ProductVariationDetailsDto[];
}
