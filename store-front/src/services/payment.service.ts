import api from "./api";

export interface CreateCheckoutSessionDto {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string; // ✅ Identificador do produto para criar order-items
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

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  countries: string[];
  isActive: boolean;
}

class PaymentService {
  // Configuração centralizada
  private readonly DEFAULT_PAYMENT_METHOD = "card";

  async createCheckoutSession(
    data: CreateCheckoutSessionDto
  ): Promise<CheckoutSessionResponse> {
    try {
      console.log(
        "💳 Criando sessão de checkout com método:",
        this.DEFAULT_PAYMENT_METHOD
      );

      const response = await api.post(`payments/checkout`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
      throw error;
    }
  }

  async getSession(sessionId: string) {
    try {
      const response = await api.get(`payments/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter sessão:", error);
      throw error;
    }
  }

  async getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get(`payments/payment-methods`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter métodos de pagamento:", error);
      throw error;
    }
  }

  // Método para obter método padrão
  getDefaultPaymentMethod(): string {
    return this.DEFAULT_PAYMENT_METHOD;
  }

  // Método para verificar se um método está disponível
  isPaymentMethodAvailable(methodId: string): boolean {
    return methodId === this.DEFAULT_PAYMENT_METHOD;
  }
}

export default new PaymentService();
