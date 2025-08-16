import api from "./api";

export interface CreateCheckoutSessionDto {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string;
  }>;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  shippingAddress: string;
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

class PaymentService {
  async createCheckoutSession(
    data: CreateCheckoutSessionDto
  ): Promise<CheckoutSessionResponse> {
    const response = await api.post(`payments/checkout`, data);
    return response.data;
  }

  async getSession(sessionId: string) {
    const response = await api.get(`payments/session/${sessionId}`);
    return response.data;
  }
}

export default new PaymentService();
