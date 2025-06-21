import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCollectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;
}
