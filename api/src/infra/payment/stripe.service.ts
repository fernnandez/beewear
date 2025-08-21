import { Injectable } from '@nestjs/common';
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

  constructor() {
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
        // POSSO ADICIONAR METADADOS AQUI
      },
    };

    const session = await this.stripe.checkout.sessions.create(sessionConfig);

    return {
      id: session.id,
      url: session.url,
    };
  }

  async verifyPaymentStatus(sessionId: string) {
    try {
      console.log(`🔄 Verificando status da sessão do Stripe: ${sessionId}`);

      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent', 'customer', 'line_items'],
      });

      console.log(
        `📊 Status da sessão: ${session.status}, Pagamento: ${session.payment_status}`,
      );

      // Buscar informações detalhadas do pagamento
      let paymentDetails: any = null;
      if (
        session.payment_intent &&
        typeof session.payment_intent === 'object'
      ) {
        const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
        paymentDetails = {
          id: paymentIntent.id,
          method: paymentIntent.payment_method_types[0], // ['card', 'pix', etc.]
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: paymentIntent.created,
        };

        // Se for cartão, buscar detalhes adicionais
        if (
          paymentIntent.payment_method &&
          typeof paymentIntent.payment_method === 'object'
        ) {
          const paymentMethod =
            paymentIntent.payment_method as Stripe.PaymentMethod;
          if (paymentMethod.type === 'card' && paymentMethod.card) {
            paymentDetails.card = {
              brand: paymentMethod.card.brand, // visa, mastercard, etc.
              last4: paymentMethod.card.last4,
              expMonth: paymentMethod.card.exp_month,
              expYear: paymentMethod.card.exp_year,
            };
          }
        }
      }

      // Buscar informações do cliente
      let customerInfo: any = null;
      if (session.customer && typeof session.customer === 'object') {
        const customer = session.customer as Stripe.Customer;
        customerInfo = {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
        };
      }

      return {
        success: true,
        sessionId: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email,
        metadata: session.metadata,
        createdAt: session.created,
        expiresAt: session.expires_at,
        // Novas informações detalhadas
        paymentDetails,
        customerInfo,
        // Informações de endereço
        billingAddress:
          session.billing_address_collection === 'required'
            ? {
                country: session.customer_details?.address?.country,
                state: session.customer_details?.address?.state,
                city: session.customer_details?.address?.city,
                line1: session.customer_details?.address?.line1,
                line2: session.customer_details?.address?.line2,
                postalCode: session.customer_details?.address?.postal_code,
              }
            : null,
        // Informações de envio
        shippingAddress: session.shipping_address_collection
          ? {
              country: session.shipping_address_collection.allowed_countries,
            }
          : null,
      };
    } catch (error) {
      console.error(
        `❌ Erro ao verificar status da sessão ${sessionId}:`,
        error,
      );
      throw new Error('Erro ao verificar status da sessão do Stripe');
    }
  }
}
