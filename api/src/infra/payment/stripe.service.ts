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
      console.log(
        `🔄 Verificando status do pagamento para sessão: ${sessionId}`,
      );

      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      console.log(
        `📊 Status da sessão: ${session.status}, Pagamento: ${session.payment_status}`,
      );

      // Verificar se já existe um pedido para esta sessão
      const existingOrder =
        await this.orderService.findOrderByStripeSession(sessionId);

      if (existingOrder) {
        console.log(
          `✅ Pedido já existe para sessão ${sessionId}: ${existingOrder.publicId}`,
        );
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
        console.log(
          `💳 Pagamento aprovado para sessão ${sessionId}, criando pedido...`,
        );

        // Extrair dados dos produtos dos METADADOS
        let orderItems: any[] = [];

        if (session.metadata?.items) {
          try {
            orderItems = JSON.parse(session.metadata.items);
            console.log(
              `📦 Itens extraídos dos metadados: ${orderItems.length} itens`,
            );
          } catch (parseError) {
            console.warn(
              `⚠️ Erro ao fazer parse dos metadados, usando dados padrão:`,
              parseError,
            );
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
          console.warn(`⚠️ Metadados não encontrados, usando dados padrão`);
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

        console.log(`🛒 Dados do pedido preparados, criando...`);

        // Criar pedido usando email do cliente
        const order = await this.orderService.createOrderFromPayment(orderData);

        console.log(`✅ Pedido criado com sucesso: ${order.publicId}`);

        return {
          success: true,
          paymentStatus: 'paid',
          message: 'Pagamento confirmado e pedido criado',
          order,
          alreadyExists: false,
        };
      } else {
        console.log(
          `❌ Pagamento não aprovado. Status: ${session.status}, Payment: ${session.payment_status}`,
        );
        return {
          success: false,
          paymentStatus: session.payment_status || 'unknown',
          message: 'Pagamento não foi aprovado',
          order: null,
          alreadyExists: false,
        };
      }
    } catch (error) {
      console.error(
        `❌ Erro ao verificar status do pagamento para sessão ${sessionId}:`,
        error,
      );
      throw new Error('Erro ao verificar status do pagamento');
    }
  }
}
