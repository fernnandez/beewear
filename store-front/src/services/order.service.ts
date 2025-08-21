import api from './api';

export interface CreateOrderItem {
  productVariationSizePublicId: string;
  productVariationPublicId: string;
  quantity: number;
}

export interface CreateOrder {
  items: Array<{
    productVariationSizePublicId: string;
    productVariationPublicId: string;
    quantity: number;
  }>;
  shippingAddressString: string; // Endereço completo como string
  notes?: string;
}

export interface OrderResponse {
  publicId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingCost: number;
  shippingAddress: string;
  paymentMethodType: string;
  paymentMethodName: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
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

export interface ValidateStockItem {
  productVariationSizePublicId: string;
  quantity: number;
}

export interface ValidateStockRequest {
  items: ValidateStockItem[];
}

export interface ValidateStockItemResponse {
  productVariationSizePublicId: string;
  productName: string;
  variationName: string;
  size: string;
  color: string;
  requestedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  price: number;
}

export interface ValidateStockResponse {
  isValid: boolean;
  items: ValidateStockItemResponse[];
  totalAmount: number;
  message?: string;
}

class OrderService {
  async createOrder(orderData: CreateOrder): Promise<OrderResponse> {
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  async confirmOrder(publicId: string, sessionId: string): Promise<OrderResponse> {
    const response = await api.post(`/orders/confirm/${publicId}`, { sessionId });
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

  async validateStock(validateStockData: ValidateStockRequest): Promise<ValidateStockResponse> {
    const response = await api.post('/orders/validate-stock', validateStockData);
    return response.data;
  }
}

export default new OrderService();
