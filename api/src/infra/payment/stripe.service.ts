import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/domain/order/order.service';
import Stripe from 'stripe';

export interface CreateCheckoutSessionDto {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string; // ✅ Identificador do produto para criar order-items
  }>;
  shippingAddress: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface PaymentOrderData {
  userId: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string;
  }>;
  shippingAddress: string;
  totalAmount: number;
  stripeSessionId: string;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;

  // Configuração centralizada dos métodos de pagamento
  private readonly PAYMENT_METHODS = ['card'];
  private readonly CURRENCY = 'eur';
  private readonly COUNTRY = 'PT';

  constructor(private readonly orderService: OrderService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCheckoutSession(data: CreateCheckoutSessionDto) {
    console.log('🔍 Criando sessão de checkout:', {
      items: data.items.length,
      paymentMethods: this.PAYMENT_METHODS,
      currency: this.CURRENCY,
      country: this.COUNTRY,
    });

    // ✅ Preparar dados dos itens para metadados
    const itemsMetadata = data.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      images: item.images || [],
      productVariationSizePublicId: item.productVariationSizePublicId, // ✅ Incluir identificador do produto
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: this.PAYMENT_METHODS as any,
      mode: 'payment',
      line_items: data.items.map((item) => ({
        price_data: {
          currency: this.CURRENCY,
          product_data: {
            name: item.name,
            images: item.images || [],
          },
          unit_amount: Math.round(item.price * 100), // valor em CENTAVOS
        },
        quantity: item.quantity,
      })),
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,
      metadata: {
        order_type: 'checkout',
        country: this.COUNTRY,
        payment_methods: this.PAYMENT_METHODS.join(','),
        // ✅ Salvar dados dos itens nos metadados
        items: JSON.stringify(itemsMetadata),
        total_items: data.items.length.toString(),
        // ✅ Salvar endereço de entrega nos metadados
        shipping_address: data.shippingAddress,
      },
    });

    console.log('✅ Sessão criada com sucesso:', {
      id: session.id,
      url: session.url,
      payment_method_types: session.payment_method_types,
      metadata: session.metadata,
    });

    return {
      id: session.id,
      url: session.url,
    };
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  // Método para obter métodos de pagamento disponíveis
  async getAvailablePaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Cartão de Crédito/Débito',
        description: 'Visa, Mastercard, American Express e outros',
        icon: '💳',
        countries: ['global'],
        isActive: true,
      },
    ];
  }

  async verifyPaymentStatus(userId: number, sessionId: string) {
    try {
      console.log('�� Verificando status do pagamento na Stripe:', sessionId);

      // ✅ PRIMEIRO: Verificar se pedido já existe
      const existingOrder =
        await this.orderService.findOrderByStripeSession(sessionId);

      if (existingOrder) {
        console.log('⚠️ Pedido já existe para esta sessão:', existingOrder.id);
        return {
          success: true,
          paymentStatus: 'paid',
          message: 'Pedido já foi criado anteriormente',
          order: existingOrder,
          alreadyExists: true,
        };
      }

      // ✅ Buscar sessão SEM expand (que estava causando erro)
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      console.log(JSON.stringify(session, null, 2));

      console.log('📋 Status da sessão:', {
        id: session.id,
        userId,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        customer_email: session.customer_email,
        shipping_address:
          session.metadata?.shipping_address || 'Endereço não informado',
        line_items_count: session.line_items?.data?.length || 0,
      });

      // ✅ Verificar se o pagamento foi aprovado
      if (session.payment_status === 'paid' && session.status === 'complete') {
        console.log('✅ Pagamento confirmado! Criando pedido...');

        // ✅ Extrair dados dos produtos dos METADADOS (solução que funciona)
        let orderItems: any[] = [];

        if (session.metadata?.items) {
          try {
            // ✅ Usar dados salvos nos metadados (sempre disponível)
            orderItems = JSON.parse(session.metadata.items);
            console.log('✅ Dados extraídos dos metadados:', orderItems);
          } catch (e) {
            console.log('❌ Erro ao parsear metadados:', e);
            // Fallback para item genérico
            orderItems = [
              {
                name: 'Produto do Checkout',
                price: (session.amount_total || 0) / 100,
                quantity: 1,
                images: [],
              },
            ];
          }
        } else {
          // ✅ Fallback se não houver metadados
          console.log('⚠️ Metadados não disponíveis, criando item genérico');
          orderItems = [
            {
              name: 'Produto do Checkout',
              price: (session.amount_total || 0) / 100,
              quantity: 1,
              images: [],
            },
          ];
        }

        const orderData = {
          userId,
          customerEmail: session.customer_email,
          items: orderItems,
          totalAmount: (session.amount_total || 0) / 100,
          stripeSessionId: session.id,
          shippingAddress:
            session.metadata?.shipping_address || 'Endereço não informado',
        };

        console.log('📦 Dados do pedido preparados:', orderData);

        // ✅ Criar pedido usando email do cliente
        const order = await this.orderService.createOrderFromPayment(orderData);

        return {
          success: true,
          paymentStatus: 'paid',
          message: 'Pagamento confirmado e pedido criado',
          order,
          alreadyExists: false,
        };
      } else {
        console.log('❌ Pagamento não foi aprovado:', {
          payment_status: session.payment_status,
          status: session.status,
        });

        return {
          success: false,
          paymentStatus: session.payment_status,
          message: 'Pagamento não foi aprovado',
          order: null,
          alreadyExists: false,
        };
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }

  // Método para verificar se um método está ativo
  isPaymentMethodActive(methodId: string): boolean {
    return this.PAYMENT_METHODS.includes(methodId);
  }
}
