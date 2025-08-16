import { OrderStatus } from '../enums/order-status.enum';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  publicId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingCost: number;
  shippingAddress: string;
  paymentMethodType: string;
  paymentMethodName: string;
  paymentStatus: string;
  notes?: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
