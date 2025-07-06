import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductVariationDto {
  @ApiProperty({
    description: 'cor da variação do produto',
    example: '#1a2b3c',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: 'nome da variação do produto (ex: Camiseta Laranja)',
    example: 'Camiseta Básica - Laranja',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Preço da variação do produto',
    example: 49.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01) // Aplica o validador Min(0.01) apenas se o preço for fornecido
  price: number;
}
