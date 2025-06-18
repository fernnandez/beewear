import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto Teste' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '4c4b0254-6534-5960-a296-f05f537f7c53' })
  @IsNotEmpty()
  @IsString()
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

  @ApiProperty({ examples: ['P', 'M', 'G'] })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({ example: 99.99 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  initialStock: number;
}
