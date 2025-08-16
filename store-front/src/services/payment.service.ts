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

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  countries: string[];
  isActive: boolean;
  features?: string[];
}

class PaymentService {
  async createCheckoutSession(
    data: CreateCheckoutSessionDto
  ): Promise<CheckoutSessionResponse> {
    try {
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

  // Método simplificado - a Stripe gerencia tudo
  isPaymentMethodAvailableForCountry(): boolean {
    // Como a Stripe gerencia tudo, sempre retorna true
    return true;
  }

  // Método para obter métodos ativos localmente (fallback)
  getLocalPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "stripe_managed",
        name: "Métodos de Pagamento",
        description: "Configurados automaticamente pela Stripe",
        icon: "💳",
        countries: ["PT"],
        isActive: true,
        features: [
          "Configuração automática", 
          "Métodos atualizados", 
          "Sem manutenção",
          "Suporte oficial Stripe"
        ],
      },
    ];
  }

  // Método para ativar/desativar métodos de pagamento (não é mais necessário)
  async togglePaymentMethod(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'Métodos gerenciados automaticamente pela Stripe',
    };
  }
}

export default new PaymentService();
