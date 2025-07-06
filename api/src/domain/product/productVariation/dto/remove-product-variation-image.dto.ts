import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveProductVariationImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  image: string;
}
