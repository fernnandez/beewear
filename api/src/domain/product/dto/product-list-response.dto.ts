import { ApiProperty } from '@nestjs/swagger';

export class CollectionSummaryDto {
  @ApiProperty({ description: 'PublicId da coleção' })
  publicId: string;

  @ApiProperty({ description: 'Nome da coleção' })
  name: string;

  @ApiProperty({ description: 'Status ativo da coleção' })
  active: boolean;

  @ApiProperty({ description: 'Descrição da coleção', required: false })
  description?: string;

  @ApiProperty({ description: 'URL da imagem da coleção', required: false })
  imageUrl?: string;
}

export class ProductVariationSizeSummaryDto {
  @ApiProperty({ description: 'Tamanho do produto' })
  size: string;

  @ApiProperty({ description: 'Informações de estoque' })
  stock: {
    quantity: number;
  };
}

export class ProductVariationSummaryDto {
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
  sizes: ProductVariationSizeSummaryDto[];
}

export class ProductListResponseDto {
  @ApiProperty({ description: 'PublicId do produto' })
  publicId: string;

  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @ApiProperty({ description: 'Status ativo do produto' })
  active: boolean;

  @ApiProperty({ description: 'Coleção do produto', required: false })
  collection?: CollectionSummaryDto;

  @ApiProperty({ description: 'Variações do produto' })
  variations: ProductVariationSummaryDto[];
}
