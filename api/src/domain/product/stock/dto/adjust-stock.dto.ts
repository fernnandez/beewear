import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdjustStockDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  // @IsNotEmpty()
  // @IsEnum(['IN', 'OUT'])
  // type: 'IN' | 'OUT';

  @IsOptional()
  @IsString()
  description?: string;
}
