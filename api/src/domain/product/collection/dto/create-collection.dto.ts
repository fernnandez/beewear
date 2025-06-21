import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Coleção Teste' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'descrição da coleção' })
  @IsOptional()
  @IsString()
  descripttion: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/masculina.jpg' })
  @IsOptional()
  @IsString()
  imageUrl: string;
}
