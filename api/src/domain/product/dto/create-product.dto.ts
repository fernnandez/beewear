import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Size } from '../productVariation/product-variation-size.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto Teste' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @ApiProperty({ example: '4c4b0254-6534-5960-a296-f05f537f7c53' })
  @IsNotEmpty()
  @IsUUID('4')
  collectionPublicId: string;

  @ApiProperty({
    type: () => CreateProductVariationDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariationDto)
  variations: CreateProductVariationDto[];
}

export class CreateProductVariationDto {
  @ApiProperty({ example: '#d7fa92' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ example: 'azul royal' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 99.99 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ examples: ['XS', 'S', 'M', 'L'] })
  @IsNotEmpty()
  @IsEnum(Size, { each: true })
  sizes: Size[];
}
