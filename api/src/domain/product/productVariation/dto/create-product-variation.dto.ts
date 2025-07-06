import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
  @IsOptional() // <-- Adicione IsOptional AQUI!
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  images?: string[];
}
