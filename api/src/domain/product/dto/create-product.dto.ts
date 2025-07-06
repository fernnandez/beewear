import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateProductVariationDto } from '../productVariation/dto/create-product-variation.dto';

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
