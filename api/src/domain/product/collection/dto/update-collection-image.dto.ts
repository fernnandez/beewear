import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCollectionImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  image: string;
}
