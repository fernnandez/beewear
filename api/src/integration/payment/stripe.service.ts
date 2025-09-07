import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import {
  CreateCheckoutSessionDto,
  PaymentProvider,
  PaymentVerificationResult,
} from './payment.interface';

@Injectable()
export class StripeService implements PaymentProvider {
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

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Stripe gerencia automaticamente os métodos disponíveis
      line_items: itemsMetadata.map((item) => ({
        price_data: {
          currency: this.CURRENCY,
          product_data: {
            name: item.name,
            images: item.images,
          },
          unit_amount: Math.round(item.price * 100), // Converter para centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,
      metadata: {
        items: JSON.stringify(itemsMetadata),
      },
    });

    return {
      id: session.id,
      url: session.url || '',
    };
  }

  async verifyPaymentStatus(
    sessionId: string,
  ): Promise<PaymentVerificationResult> {
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
        };
      }

      return {
        success: true,
        status: session.status || 'unknown',
        paymentStatus: session.payment_status || 'unknown',
        sessionId: session.id,
        paymentIntentId: paymentDetails?.id,
        amountTotal: session.amount_total || undefined,
        customerEmail: session.customer_email || undefined,
        metadata: session.metadata,
        createdAt: session.created,
        expiresAt: session.expires_at,
        paymentDetails,
        customerInfo,
        billingAddress: session.customer_details?.address,
        shippingAddress: undefined, // Stripe não expõe shipping_details diretamente
      };
    } catch (error) {
      console.error('❌ Erro ao verificar pagamento:', error);
      return {
        success: false,
        status: 'error',
        paymentStatus: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
}
