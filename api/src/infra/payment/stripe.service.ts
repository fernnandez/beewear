import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/domain/order/order.service';
import Stripe from 'stripe';

export interface CreateCheckoutSessionDto {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string;
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

  // Configuração simplificada - a Stripe gerencia os métodos automaticamente
  private readonly CURRENCY = 'eur';
  private readonly COUNTRY = 'PT';

  constructor(private readonly orderService: OrderService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCheckoutSession(data: CreateCheckoutSessionDto) {
    const itemsMetadata = data.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      images: item.images || [],
      productVariationSizePublicId: item.productVariationSizePublicId,
    }));

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: data.items.map((item) => ({
        price_data: {
          currency: this.CURRENCY,
          product_data: {
            name: item.name,
            images: item.images || [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,

      locale: 'pt',
      billing_address_collection: 'required',
      customer_creation: 'always',

      metadata: {
        order_type: 'checkout',
        country: this.COUNTRY,
        items: JSON.stringify(itemsMetadata),
        total_items: data.items.length.toString(),
        shipping_address: data.shippingAddress,
      },
    };

    const session = await this.stripe.checkout.sessions.create(sessionConfig);

    return {
      id: session.id,
      url: session.url,
    };
  }

  async verifyPaymentStatus(userId: number, sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      // Verificar se já existe um pedido para esta sessão
      const existingOrder =
        await this.orderService.findOrderByStripeSession(sessionId);
      if (existingOrder) {
        return {
          success: true,
          paymentStatus: 'already_processed',
          message: 'Pedido já foi processado para esta sessão',
          order: existingOrder,
          alreadyExists: true,
        };
      }

      // Verificar se o pagamento foi aprovado
      if (session.payment_status === 'paid' && session.status === 'complete') {
        // Extrair dados dos produtos dos METADADOS
        let orderItems: any[] = [];

        if (session.metadata?.items) {
          try {
            orderItems = JSON.parse(session.metadata.items);
          } catch {
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
          paymentMethod: 'stripe_managed',
          paymentMethodName: 'Método Stripe',
        };

        // Criar pedido usando email do cliente
        const order = await this.orderService.createOrderFromPayment(orderData);

        return {
          success: true,
          paymentStatus: 'paid',
          message: 'Pagamento confirmado e pedido criado',
          order,
          alreadyExists: false,
        };
      } else {
        return {
          success: false,
          paymentStatus: session.payment_status || 'unknown',
          message: 'Pagamento não foi aprovado',
          order: null,
          alreadyExists: false,
        };
      }
    } catch {
      throw new Error('Erro ao verificar status do pagamento');
    }
  }
}
