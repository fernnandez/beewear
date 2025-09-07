import { OrderStatus } from '../enums/order-status.enum';

export class OrderListResponseDto {
  publicId: string;
  paymentIntentId: string;
  status: OrderStatus;
  totalAmount: number;
  totalItems: number;
  paymentMethodType: string;
  paymentStatus: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
