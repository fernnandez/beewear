import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @ApiPropertyOptional({ examples: ['https://example.com/masculina.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  images: string[];
}
