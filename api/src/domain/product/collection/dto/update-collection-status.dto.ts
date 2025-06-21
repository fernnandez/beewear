import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateCollectionStatusDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive: boolean;
}
