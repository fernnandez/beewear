import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProductStatusDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive: boolean;
}
