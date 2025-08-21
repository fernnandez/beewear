export interface OrderItem {
  id: number;
  productName: string;
  variationName: string;
  color: string;
  size: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariationSizePublicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  publicId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingCost: number;
  shippingAddress: string;
  paymentMethodType: string; // String simples - o que vier do backend
  paymentStatus: PaymentStatus;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderList {
  publicId: string;
  status: OrderStatus;
  totalAmount: number;
  totalItems: number;
  paymentMethodType: string; // String simples - o que vier do backend
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
