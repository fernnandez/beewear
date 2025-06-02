import { IsUUID, IsInt, Min } from 'class-validator';

export class RegisterStockDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number;
}
