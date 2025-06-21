import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Coleção Teste', type: 'string' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Descrição da coleção', type: 'string' })
  @IsOptional()
  @IsString()
  descripttion?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/masculina.jpg' })
  @IsOptional()
  @IsString()
  imageUrl: string;
}
