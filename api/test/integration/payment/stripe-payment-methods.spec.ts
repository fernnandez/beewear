import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderModule } from '../../../src/domain/order/order.module';
import { AuthModule } from '../../../src/infra/auth/auth.module';
import { DatabaseModule } from '../../../src/infra/database/database.module';
import { StripeController } from '../../../src/infra/payment/stripe.controller';
import { StripeService } from '../../../src/infra/payment/stripe.service';

describe('Stripe Payment Methods (e2e)', () => {
  let app: INestApplication;
  let stripeService: StripeService;
  let stripeController: StripeController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DatabaseModule,
        OrderModule,
        AuthModule,
      ],
      controllers: [StripeController],
      providers: [StripeService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    stripeService = moduleFixture.get<StripeService>(StripeService);
    stripeController = moduleFixture.get<StripeController>(StripeController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /payments/payment-methods', () => {
    it('should return available payment methods for Portugal', async () => {
      const methods = await stripeService.getAvailablePaymentMethods();

      expect(methods).toBeDefined();
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBeGreaterThan(0);

      // Verificar se os métodos estão configurados para Portugal
      methods.forEach((method) => {
        expect(method.countries).toContain('PT');
        expect(method.isActive).toBe(true);
        expect(method.id).toBeDefined();
        expect(method.name).toBeDefined();
        expect(method.description).toBeDefined();
        expect(method.icon).toBeDefined();
      });

      // Verificar se cartão e Klarna estão disponíveis
      const methodIds = methods.map((m) => m.id);
      expect(methodIds).toContain('card');
      expect(methodIds).toContain('klarna');
    });

    it('should return correct features for each payment method', async () => {
      const methods = await stripeService.getAvailablePaymentMethods();

      methods.forEach((method) => {
        if (method.id === 'card') {
          expect(method.features).toContain('Pagamento imediato');
          expect(method.features).toContain('Seguro pela Stripe');
        }

        if (method.id === 'klarna') {
          expect(method.features).toContain('4x sem juros');
          expect(method.features).toContain('Pagamento em 30 dias');
        }
      });
    });
  });

  describe('Payment Method Validation', () => {
    it('should validate card payment method as active', () => {
      const isActive = stripeService.isPaymentMethodActive('card');
      expect(isActive).toBe(true);
    });

    it('should validate klarna payment method as active', () => {
      const isActive = stripeService.isPaymentMethodActive('klarna');
      expect(isActive).toBe(true);
    });

    it('should validate non-existent payment method as inactive', () => {
      const isActive = stripeService.isPaymentMethodActive('non_existent');
      expect(isActive).toBe(false);
    });
  });

  describe('Payment Method Toggle', () => {
    it('should toggle payment method status', async () => {
      // Testar desativar um método
      const result1 = await stripeService.togglePaymentMethod('card', false);
      expect(result1).toBe(true);

      // Verificar se foi desativado
      const isActive1 = stripeService.isPaymentMethodActive('card');
      expect(isActive1).toBe(false);

      // Reativar o método
      const result2 = await stripeService.togglePaymentMethod('card', true);
      expect(result2).toBe(true);

      // Verificar se foi reativado
      const isActive2 = stripeService.isPaymentMethodActive('card');
      expect(isActive2).toBe(true);
    });

    it('should return false for non-existent payment method', async () => {
      const result = await stripeService.togglePaymentMethod(
        'non_existent',
        true,
      );
      expect(result).toBe(false);
    });
  });

  describe('Checkout Session Creation', () => {
    it('should create checkout session with card payment method', async () => {
      const checkoutData = {
        items: [
          {
            name: 'Produto Teste',
            price: 29.99,
            quantity: 1,
            images: [],
            productVariationSizePublicId: 'test-id',
          },
        ],
        shippingAddress: 'Rua Teste, 123, Lisboa, Portugal',
        successUrl: 'http://localhost:3000/success',
        cancelUrl: 'http://localhost:3000/cancel',
        customerEmail: 'test@example.com',
        paymentMethod: 'card',
      };

      const session = await stripeService.createCheckoutSession(checkoutData);

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.url).toBeDefined();
      expect(session.paymentMethod).toBe('card');
    });

    it('should create checkout session with klarna payment method', async () => {
      const checkoutData = {
        items: [
          {
            name: 'Produto Teste Klarna',
            price: 49.99,
            quantity: 1,
            images: [],
            productVariationSizePublicId: 'test-klarna-id',
          },
        ],
        shippingAddress: 'Rua Teste, 456, Porto, Portugal',
        successUrl: 'http://localhost:3000/success',
        cancelUrl: 'http://localhost:3000/cancel',
        customerEmail: 'test-klarna@example.com',
        paymentMethod: 'klarna',
      };

      const session = await stripeService.createCheckoutSession(checkoutData);

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.url).toBeDefined();
      expect(session.paymentMethod).toBe('klarna');
    });

    it('should throw error for invalid payment method', async () => {
      const checkoutData = {
        items: [
          {
            name: 'Produto Teste',
            price: 29.99,
            quantity: 1,
            images: [],
            productVariationSizePublicId: 'test-id',
          },
        ],
        shippingAddress: 'Rua Teste, 123, Lisboa, Portugal',
        successUrl: 'http://localhost:3000/success',
        cancelUrl: 'http://localhost:3000/cancel',
        customerEmail: 'test@example.com',
        paymentMethod: 'invalid_method',
      };

      await expect(
        stripeService.createCheckoutSession(checkoutData),
      ).rejects.toThrow(
        'Método de pagamento invalid_method não está disponível',
      );
    });
  });
});
