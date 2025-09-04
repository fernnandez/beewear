import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../../src/domain/order/payment.controller';

describe('PaymentController', () => {
  let controller: PaymentController;

  const mockPaymentService = {
    createCheckoutSession: jest.fn(),
    verifyPaymentStatus: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: 'PaymentProvider',
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  describe('createCheckoutSession', () => {
    it('should create checkout session successfully', async () => {
      const mockData = {
        items: [
          {
            name: 'Test Product',
            price: 50,
            quantity: 2,
            images: ['test.jpg'],
            productVariationSizePublicId: 'size-1',
          },
        ],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        customerEmail: 'test@example.com',
      };

      const mockResult = {
        id: 'session-123',
        url: 'https://checkout.stripe.com/session-123',
      };

      mockPaymentService.createCheckoutSession.mockResolvedValue(mockResult);

      const result = await controller.createCheckoutSession(mockData);

      expect(mockPaymentService.createCheckoutSession).toHaveBeenCalledWith(
        mockData,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle payment service errors', async () => {
      const mockData = {
        items: [],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };

      const error = new Error('Payment service error');
      mockPaymentService.createCheckoutSession.mockRejectedValue(error);

      await expect(controller.createCheckoutSession(mockData)).rejects.toThrow(
        error,
      );
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const sessionId = 'session-123';
      const mockResult = {
        success: true,
        status: 'complete',
        paymentStatus: 'paid',
        sessionId,
        amountTotal: 10000,
        customerEmail: 'test@example.com',
      };

      mockPaymentService.verifyPaymentStatus.mockResolvedValue(mockResult);

      const result = await controller.verifyPayment(sessionId);

      expect(mockPaymentService.verifyPaymentStatus).toHaveBeenCalledWith(
        sessionId,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle payment verification errors and throw BadRequestException', async () => {
      const sessionId = 'invalid-session';
      const error = new Error('Session not found');

      mockPaymentService.verifyPaymentStatus.mockRejectedValue(error);

      await expect(controller.verifyPayment(sessionId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.verifyPayment(sessionId)).rejects.toThrow(
        'Erro ao verificar pagamento: Session not found',
      );
    });

    it('should handle non-Error objects in catch block', async () => {
      const sessionId = 'invalid-session';
      const error = 'String error message';

      mockPaymentService.verifyPaymentStatus.mockRejectedValue(error);

      await expect(controller.verifyPayment(sessionId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.verifyPayment(sessionId)).rejects.toThrow(
        'Erro ao verificar pagamento: String error message',
      );
    });

    it('should handle errors without message property', async () => {
      const sessionId = 'invalid-session';
      const error = { code: 'INVALID_SESSION' };

      mockPaymentService.verifyPaymentStatus.mockRejectedValue(error);

      await expect(controller.verifyPayment(sessionId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.verifyPayment(sessionId)).rejects.toThrow(
        'Erro ao verificar pagamento: [object Object]',
      );
    });
  });
});
