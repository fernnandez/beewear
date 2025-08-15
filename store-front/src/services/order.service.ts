import api from './api';

export interface CreateOrderItem {
  productVariationSizePublicId: string;
  productVariationPublicId: string;
  quantity: number;
}

export interface CreateOrder {
  items: CreateOrderItem[];
  shippingAddressId: number;
  shippingAddressString: string; // Endereço completo como string
  paymentMethodType: 'CREDIT_CARD' | 'PIX' | 'BANK_TRANSFER';
  paymentMethodName: string;
  notes?: string;
}

export interface OrderResponse {
  publicId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingCost: number;
  shippingAddress: {
    id: number;
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethodType: string;
  paymentMethodName: string;
  paymentStatus: string;
  notes?: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
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

export interface OrderListResponse {
  publicId: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  paymentMethodType: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatus {
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
}

class OrderService {
  async createOrder(orderData: CreateOrder): Promise<OrderResponse> {
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  async findUserOrders(): Promise<OrderListResponse[]> {
    const response = await api.get('/orders/my-orders');
    return response.data;
  }

  async findOrderByPublicId(publicId: string): Promise<OrderResponse> {
    const response = await api.get(`/orders/${publicId}`);
    return response.data;
  }

  async updateOrderStatus(
    publicId: string,
    updateData: UpdateOrderStatus,
  ): Promise<OrderResponse> {
    const response = await api.put(`/orders/${publicId}/status`, updateData);
    return response.data;
  }
}

export default new OrderService();
