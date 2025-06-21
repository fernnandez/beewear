import { ApiProperty } from '@nestjs/swagger';

export class ProductVariationSummaryDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;
}

export class ProductWithVariationsDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ProductVariationSummaryDto] })
  variations: ProductVariationSummaryDto[];
}

export class CollectionAggregationsDto {
  @ApiProperty()
  totalProducts: number;

  @ApiProperty()
  totalStock: number;

  @ApiProperty()
  totalValue: number;
}

export class CollectionDetailsDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  imageUrl?: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: CollectionAggregationsDto })
  aggregations: CollectionAggregationsDto;

  @ApiProperty({ type: [ProductWithVariationsDto] })
  products: ProductWithVariationsDto[];
}
