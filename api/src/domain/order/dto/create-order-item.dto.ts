import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productVariationSizePublicId: string;

  @IsString()
  productVariationPublicId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
