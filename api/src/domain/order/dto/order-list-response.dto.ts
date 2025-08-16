import { OrderStatus } from '../enums/order-status.enum';

export class OrderListResponseDto {
  publicId: string;
  status: OrderStatus;
  totalAmount: number;
  totalItems: number;
  paymentMethodType: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
