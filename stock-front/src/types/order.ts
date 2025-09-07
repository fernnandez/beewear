export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface Order {
  publicId: string;
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

export interface OrderDetails {
  publicId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingCost: number;
  shippingAddress: string;
  paymentMethodType: string;
  paymentStatus: string;
  paymentIntentId: string;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  productName: string;
  variationName: string;
  color: string;
  size: string;
  image?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariationSizePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
}
