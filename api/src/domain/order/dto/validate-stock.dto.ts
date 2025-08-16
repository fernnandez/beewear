import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ValidateStockItemDto {
  @IsString()
  productVariationSizePublicId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class ValidateStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateStockItemDto)
  items: ValidateStockItemDto[];
}
