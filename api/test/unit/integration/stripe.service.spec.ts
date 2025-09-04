import { StripeService } from 'src/integration/payment/stripe.service';
import Stripe from 'stripe';

describe('StripeService', () => {
  let service: StripeService;
  let stripeInstance: Stripe;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Salvar o valor original da variável de ambiente
    originalEnv = process.env.STRIPE_SECRET_KEY;

    // Definir a variável de ambiente para o teste
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_testing';

    // cria uma instância real
    stripeInstance = new Stripe('fake-key') as any;
    service = new StripeService();

    // força o serviço a usar nossa instância mockada
    (service as any).stripe = stripeInstance;
  });

  afterEach(() => {
    // Restaurar o valor original da variável de ambiente
    if (originalEnv !== undefined) {
      process.env.STRIPE_SECRET_KEY = originalEnv;
    } else {
      delete process.env.STRIPE_SECRET_KEY;
    }
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session successfully', async () => {
      // arrange
      const mockSession = {
        id: 'sess_123',
        url: 'https://stripe.com/checkout/sess_123',
      };

      // espiona o método e substitui retorno
      jest
        .spyOn(stripeInstance.checkout.sessions, 'create')
        .mockResolvedValue(mockSession as any);

      const dto = {
        items: [
          {
            name: 'Camisa',
            price: 50,
            quantity: 1,
            images: ['https://example.com/img.jpg'],
            productVariationSizePublicId: 'var_123',
          },
        ],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        customerEmail: 'cliente@example.com',
      };

      // act
      const result = await service.createCheckoutSession(dto);

      // assert
      expect(result).toEqual({
        id: 'sess_123',
        url: 'https://stripe.com/checkout/sess_123',
      });

      expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'payment',
          customer_email: 'cliente@example.com',
        }),
      );
    });

    it('should create a checkout session with multiple items', async () => {
      // arrange
      const mockSession = {
        id: 'sess_multi_123',
        url: 'https://stripe.com/checkout/sess_multi_123',
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'create')
        .mockResolvedValue(mockSession as any);

      const dto = {
        items: [
          {
            name: 'Camisa',
            price: 50,
            quantity: 2,
            images: ['https://example.com/img1.jpg'],
            productVariationSizePublicId: 'var_123',
          },
          {
            name: 'Calça',
            price: 80,
            quantity: 1,
            images: ['https://example.com/img2.jpg'],
            productVariationSizePublicId: 'var_456',
          },
        ],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        customerEmail: 'cliente@example.com',
      };

      // act
      const result = await service.createCheckoutSession(dto);

      // assert
      expect(result).toEqual({
        id: 'sess_multi_123',
        url: 'https://stripe.com/checkout/sess_multi_123',
      });

      expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price_data: expect.objectContaining({
                product_data: expect.objectContaining({
                  name: 'Camisa',
                  images: ['https://example.com/img1.jpg'],
                }),
                unit_amount: 5000, // 50 * 100
              }),
              quantity: 2,
            }),
            expect.objectContaining({
              price_data: expect.objectContaining({
                product_data: expect.objectContaining({
                  name: 'Calça',
                  images: ['https://example.com/img2.jpg'],
                }),
                unit_amount: 8000, // 80 * 100
              }),
              quantity: 1,
            }),
          ]),
        }),
      );
    });

    it('should handle items without images', async () => {
      // arrange
      const mockSession = {
        id: 'sess_no_images_123',
        url: 'https://stripe.com/checkout/sess_no_images_123',
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'create')
        .mockResolvedValue(mockSession as any);

      const dto = {
        items: [
          {
            name: 'Produto sem imagem',
            price: 30,
            quantity: 1,
            productVariationSizePublicId: 'var_789',
          },
        ],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        customerEmail: 'cliente@example.com',
      };

      // act
      const result = await service.createCheckoutSession(dto);

      // assert
      expect(result).toEqual({
        id: 'sess_no_images_123',
        url: 'https://stripe.com/checkout/sess_no_images_123',
      });

      expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price_data: expect.objectContaining({
                product_data: expect.objectContaining({
                  name: 'Produto sem imagem',
                  images: [],
                }),
              }),
            }),
          ]),
        }),
      );
    });

    it('should handle session without URL', async () => {
      // arrange
      const mockSession = {
        id: 'sess_no_url_123',
        url: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'create')
        .mockResolvedValue(mockSession as any);

      const dto = {
        items: [
          {
            name: 'Produto',
            price: 25,
            quantity: 1,
            productVariationSizePublicId: 'var_999',
          },
        ],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        customerEmail: 'cliente@example.com',
      };

      // act
      const result = await service.createCheckoutSession(dto);

      // assert
      expect(result).toEqual({
        id: 'sess_no_url_123',
        url: '',
      });
    });
  });

  describe('verifyPaymentStatus', () => {
    it('should verify payment status successfully with complete data', async () => {
      // arrange
      const mockSession = {
        id: 'sess_complete_123',
        status: 'complete',
        payment_status: 'paid',
        amount_total: 10000,
        customer_email: 'cliente@example.com',
        metadata: { orderId: 'order_123' },
        created: 1640995200,
        expires_at: 1641081600,
        payment_intent: {
          id: 'pi_123',
          payment_method_types: ['card'],
          amount: 10000,
          currency: 'eur',
          status: 'succeeded',
          created: 1640995200,
          payment_method: {
            type: 'card',
            card: {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2025,
            },
          },
        },
        customer: {
          id: 'cus_123',
          email: 'cliente@example.com',
          name: 'João Silva',
        },
        customer_details: {
          address: {
            line1: 'Rua das Flores, 123',
            city: 'Lisboa',
            country: 'PT',
            postal_code: '1000-001',
          },
        },
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus('sess_complete_123');

      // assert
      expect(result).toEqual({
        success: true,
        status: 'complete',
        paymentStatus: 'paid',
        sessionId: 'sess_complete_123',
        amountTotal: 10000,
        customerEmail: 'cliente@example.com',
        metadata: { orderId: 'order_123' },
        createdAt: 1640995200,
        expiresAt: 1641081600,
        paymentDetails: {
          id: 'pi_123',
          method: 'card',
          amount: 10000,
          currency: 'eur',
          status: 'succeeded',
          created: 1640995200,
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025,
          },
        },
        customerInfo: {
          id: 'cus_123',
          email: 'cliente@example.com',
          name: 'João Silva',
        },
        billingAddress: {
          line1: 'Rua das Flores, 123',
          city: 'Lisboa',
          country: 'PT',
          postal_code: '1000-001',
        },
        shippingAddress: undefined,
      });

      expect(stripeInstance.checkout.sessions.retrieve).toHaveBeenCalledWith(
        'sess_complete_123',
        { expand: ['payment_intent', 'customer', 'line_items'] },
      );
    });

    it('should verify payment status with minimal data', async () => {
      // arrange
      const mockSession = {
        id: 'sess_minimal_123',
        status: 'open',
        payment_status: 'unpaid',
        amount_total: 5000,
        customer_email: 'cliente@example.com',
        metadata: {},
        created: 1640995200,
        expires_at: 1641081600,
        payment_intent: null,
        customer: null,
        customer_details: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus('sess_minimal_123');

      // assert
      expect(result).toEqual({
        success: true,
        status: 'open',
        paymentStatus: 'unpaid',
        sessionId: 'sess_minimal_123',
        amountTotal: 5000,
        customerEmail: 'cliente@example.com',
        metadata: {},
        createdAt: 1640995200,
        expiresAt: 1641081600,
        paymentDetails: null,
        customerInfo: null,
        billingAddress: undefined,
        shippingAddress: undefined,
      });
    });

    it('should verify payment status with string payment_intent', async () => {
      // arrange
      const mockSession = {
        id: 'sess_string_pi_123',
        status: 'complete',
        payment_status: 'paid',
        amount_total: 7500,
        customer_email: 'cliente@example.com',
        metadata: {},
        created: 1640995200,
        expires_at: 1641081600,
        payment_intent: 'pi_string_123', // String em vez de objeto
        customer: null,
        customer_details: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus('sess_string_pi_123');

      // assert
      expect(result).toEqual({
        success: true,
        status: 'complete',
        paymentStatus: 'paid',
        sessionId: 'sess_string_pi_123',
        amountTotal: 7500,
        customerEmail: 'cliente@example.com',
        metadata: {},
        createdAt: 1640995200,
        expiresAt: 1641081600,
        paymentDetails: null, // Não deve processar payment_intent como string
        customerInfo: null,
        billingAddress: undefined,
        shippingAddress: undefined,
      });
    });

    it('should verify payment status with string customer', async () => {
      // arrange
      const mockSession = {
        id: 'sess_string_customer_123',
        status: 'complete',
        payment_status: 'paid',
        amount_total: 3000,
        customer_email: 'cliente@example.com',
        metadata: {},
        created: 1640995200,
        expires_at: 1641081600,
        payment_intent: null,
        customer: 'cus_string_123', // String em vez de objeto
        customer_details: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus(
        'sess_string_customer_123',
      );

      // assert
      expect(result).toEqual({
        success: true,
        status: 'complete',
        paymentStatus: 'paid',
        sessionId: 'sess_string_customer_123',
        amountTotal: 3000,
        customerEmail: 'cliente@example.com',
        metadata: {},
        createdAt: 1640995200,
        expiresAt: 1641081600,
        paymentDetails: null,
        customerInfo: null, // Não deve processar customer como string
        billingAddress: undefined,
        shippingAddress: undefined,
      });
    });

    it('should verify payment status with non-card payment method', async () => {
      // arrange
      const mockSession = {
        id: 'sess_non_card_123',
        status: 'complete',
        payment_status: 'paid',
        amount_total: 8000,
        customer_email: 'cliente@example.com',
        metadata: {},
        created: 1640995200,
        expires_at: 1641081600,
        payment_intent: {
          id: 'pi_123',
          payment_method_types: ['pix'],
          amount: 8000,
          currency: 'eur',
          status: 'succeeded',
          created: 1640995200,
          payment_method: {
            type: 'pix',
            // Sem propriedade card
          },
        },
        customer: null,
        customer_details: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus('sess_non_card_123');

      // assert
      expect(result).toEqual({
        success: true,
        status: 'complete',
        paymentStatus: 'paid',
        sessionId: 'sess_non_card_123',
        amountTotal: 8000,
        customerEmail: 'cliente@example.com',
        metadata: {},
        createdAt: 1640995200,
        expiresAt: 1641081600,
        paymentDetails: {
          id: 'pi_123',
          method: 'pix',
          amount: 8000,
          currency: 'eur',
          status: 'succeeded',
          created: 1640995200,
          // Sem propriedade card
        },
        customerInfo: null,
        billingAddress: undefined,
        shippingAddress: undefined,
      });
    });

    it('should verify payment status with string payment_method', async () => {
      // arrange
      const mockSession = {
        id: 'sess_string_pm_123',
        status: 'complete',
        payment_status: 'paid',
        amount_total: 6000,
        customer_email: 'cliente@example.com',
        metadata: {},
        created: 1640995200,
        expires_at: 1641081600,
        payment_intent: {
          id: 'pi_123',
          payment_method_types: ['card'],
          amount: 6000,
          currency: 'eur',
          status: 'succeeded',
          created: 1640995200,
          payment_method: 'pm_string_123', // String em vez de objeto
        },
        customer: null,
        customer_details: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus('sess_string_pm_123');

      // assert
      expect(result).toEqual({
        success: true,
        status: 'complete',
        paymentStatus: 'paid',
        sessionId: 'sess_string_pm_123',
        amountTotal: 6000,
        customerEmail: 'cliente@example.com',
        metadata: {},
        createdAt: 1640995200,
        expiresAt: 1641081600,
        paymentDetails: {
          id: 'pi_123',
          method: 'card',
          amount: 6000,
          currency: 'eur',
          status: 'succeeded',
          created: 1640995200,
          // Sem propriedade card pois payment_method é string
        },
        customerInfo: null,
        billingAddress: undefined,
        shippingAddress: undefined,
      });
    });

    it('should handle missing session data gracefully', async () => {
      // arrange
      const mockSession = {
        id: 'sess_missing_data_123',
        // status e payment_status ausentes
        amount_total: null,
        customer_email: null,
        metadata: null,
        created: null,
        expires_at: null,
        payment_intent: null,
        customer: null,
        customer_details: null,
      };

      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockSession as any);

      // act
      const result = await service.verifyPaymentStatus('sess_missing_data_123');

      // assert
      expect(result).toEqual({
        success: true,
        status: 'unknown',
        paymentStatus: 'unknown',
        sessionId: 'sess_missing_data_123',
        amountTotal: undefined,
        customerEmail: undefined,
        metadata: null,
        createdAt: null,
        expiresAt: null,
        paymentDetails: null,
        customerInfo: null,
        billingAddress: undefined,
        shippingAddress: undefined,
      });
    });

    it('should handle Stripe API error', async () => {
      // arrange
      const errorMessage = 'Session not found';
      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockRejectedValue(new Error(errorMessage));

      // act
      const result = await service.verifyPaymentStatus('sess_invalid_123');

      // assert
      expect(result).toEqual({
        success: false,
        status: 'error',
        paymentStatus: 'error',
        error: errorMessage,
      });
    });

    it('should handle non-Error exception', async () => {
      // arrange
      const errorObject = { code: 'INVALID_SESSION' };
      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockRejectedValue(errorObject);

      // act
      const result = await service.verifyPaymentStatus('sess_invalid_123');

      // assert
      expect(result).toEqual({
        success: false,
        status: 'error',
        paymentStatus: 'error',
        error: 'Erro desconhecido',
      });
    });

    it('should handle string error', async () => {
      // arrange
      const errorString = 'String error message';
      jest
        .spyOn(stripeInstance.checkout.sessions, 'retrieve')
        .mockRejectedValue(errorString);

      // act
      const result = await service.verifyPaymentStatus('sess_invalid_123');

      // assert
      expect(result).toEqual({
        success: false,
        status: 'error',
        paymentStatus: 'error',
        error: 'Erro desconhecido',
      });
    });
  });
});
