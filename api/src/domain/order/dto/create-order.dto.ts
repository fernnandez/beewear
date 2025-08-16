import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsNumber()
  @IsPositive()
  shippingAddressId: number;

  @IsString()
  shippingAddressString: string;

  @IsString()
  @IsIn(['CREDIT_CARD', 'KLARNA', 'PIX', 'BANK_TRANSFER', 'OTHER'])
  paymentMethodType: string;

  @IsString()
  paymentMethodName: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
