import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateOrderDto } from 'src/domain/order/dto/create-order.dto';
import { ValidateStockDto } from 'src/domain/order/dto/validate-stock.dto';
import { OrderStatus } from '../../../src/domain/order/enums/order-status.enum';
import { OrderItem } from '../../../src/domain/order/order-item.entity';
import { Order } from '../../../src/domain/order/order.entity';
import { OrderService } from '../../../src/domain/order/order.service';
import { ProductVariationService } from '../../../src/domain/product/productVariation/product-variation.service';
import { StockService } from '../../../src/domain/product/stock/stock.service';
import { User } from '../../../src/domain/user/user.entity';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockOrderItemRepo = {
    save: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockProductVariationService = {
    findProductVariationSizeWithRelations: jest.fn(),
  };

  const mockStockService = {
    findStockItemByProductVariationSize: jest.fn(),
    adjustStock: jest.fn(),
  };

  const mockPaymentProvider = {
    verifyPaymentStatus: jest.fn(),
    createCheckoutSession: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: ProductVariationService,
          useValue: mockProductVariationService,
        },
        {
          provide: StockService,
          useValue: mockStockService,
        },
        {
          provide: 'PaymentProvider',
          useValue: mockPaymentProvider,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrderByPublicId', () => {
    it('should return order when found', async () => {
      const mockOrder = {
        publicId: 'test-order-id',
        status: OrderStatus.PENDING,
        totalAmount: 100,
        shippingCost: 0,
        shippingAddress: 'Test Address',
        paymentMethodType: 'CREDIT_CARD',
        paymentStatus: 'PENDING',
        notes: 'Test notes',
        items: [],
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrderRepo.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOrderByPublicId('test-order-id');

      expect(mockOrderRepo.findOne).toHaveBeenCalledWith({
        where: { publicId: 'test-order-id' },
        relations: ['items', 'user'],
      });
      expect(result).toHaveProperty('publicId', 'test-order-id');
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrderRepo.findOne.mockResolvedValue(null);

      await expect(service.findOrderByPublicId('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockOrderRepo.findOne).toHaveBeenCalledWith({
        where: { publicId: 'non-existent' },
        relations: ['items', 'user'],
      });
    });
  });

  describe('findOrdersByUserId', () => {
    it('should return user orders', async () => {
      const mockOrders = [
        {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          totalAmount: 100,
          items: [{ quantity: 2 }],
          user: { id: 1, name: 'User 1', email: 'user1@example.com' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockOrderRepo.find.mockResolvedValue(mockOrders);

      const result = await service.findOrdersByUserId(1);

      expect(mockOrderRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['items', 'user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('publicId', 'order-1');
      expect(result[0]).toHaveProperty('totalItems', 2);
    });
  });

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          totalAmount: 100,
          items: [{ quantity: 1 }],
          user: { id: 1, name: 'User 1', email: 'user1@example.com' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockOrderRepo.find.mockResolvedValue(mockOrders);

      const result = await service.findAllOrders();

      expect(mockOrderRepo.find).toHaveBeenCalledWith({
        relations: ['items', 'user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('publicId', 'order-1');
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      const mockProductVariationSize = {
        productVariation: {
          product: { name: 'Test Product' },
          name: 'Test Variation',
          color: '#000000',
          price: 50,
          images: ['test.jpg'],
        },
        size: 'M',
      };
      const mockStockItem = { quantity: 10, publicId: 'stock-1' };
      const mockOrder = {
        publicId: 'order-1',
        status: OrderStatus.PENDING,
        totalAmount: 100,
        items: [],
        user: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockOrderItem = {
        id: 1,
        productName: 'Test Product',
        variationName: 'Test Variation',
        quantity: 2,
        unitPrice: 50,
        totalPrice: 100,
      };

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockProductVariationService.findProductVariationSizeWithRelations.mockResolvedValue(
        mockProductVariationSize,
      );
      mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
        mockStockItem,
      );
      mockStockService.adjustStock.mockResolvedValue(undefined);
      mockOrderRepo.save.mockResolvedValue(mockOrder);
      mockOrderItemRepo.save.mockResolvedValue(mockOrderItem);

      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productVariationSizePublicId: 'test-size-1',
            productVariationPublicId: 'test-variation-1',
            quantity: 2,
          },
        ],
        shippingAddressString: 'Test Address',
      };

      const result = await service.createOrder(1, createOrderDto);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(
        mockProductVariationService.findProductVariationSizeWithRelations,
      ).toHaveBeenCalledWith('test-size-1');
      expect(
        mockStockService.findStockItemByProductVariationSize,
      ).toHaveBeenCalledWith('test-size-1');
      expect(mockStockService.adjustStock).toHaveBeenCalledWith(
        'stock-1',
        -2,
        expect.stringContaining('Reserva'),
      );
      expect(mockOrderRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('publicId', 'order-1');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const createOrderDto: CreateOrderDto = {
        items: [],
        shippingAddressString: 'Test Address',
      };

      await expect(service.createOrder(999, createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when product not found', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockProductVariationService.findProductVariationSizeWithRelations.mockResolvedValue(
        null,
      );

      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productVariationSizePublicId: 'non-existent',
            productVariationPublicId: 'non-existent-variation',
            quantity: 1,
          },
        ],
        shippingAddressString: 'Test Address',
      };

      await expect(service.createOrder(1, createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('confirmOrder', () => {
    it('should confirm order with successful payment', async () => {
      const mockStripeSession = {
        success: true,
        paymentStatus: 'paid',
        status: 'complete',
        paymentDetails: { method: 'card' },
      };
      const mockOrder = {
        publicId: 'order-1',
        status: OrderStatus.PENDING,
        items: [],
        user: { id: 1 },
      };
      const mockConfirmedOrder = {
        ...mockOrder,
        status: OrderStatus.CONFIRMED,
        paymentStatus: 'PAID',
        paymentMethodType: 'card',
        stripeSessionId: 'session-123',
      };

      mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
        mockStripeSession,
      );
      mockOrderRepo.findOne.mockResolvedValue(mockOrder);
      mockOrderRepo.save.mockResolvedValue(mockConfirmedOrder);

      const result = await service.confirmOrder(1, 'order-1', 'session-123');

      expect(mockPaymentProvider.verifyPaymentStatus).toHaveBeenCalledWith(
        'session-123',
      );
      expect(mockOrderRepo.findOne).toHaveBeenCalledWith({
        where: { publicId: 'order-1', user: { id: 1 } },
        relations: ['items'],
      });
      expect(result).toHaveProperty('status', 'CONFIRMED');
      expect(result).toHaveProperty('paymentStatus', 'PAID');
    });

    it('should cancel order with failed payment', async () => {
      const mockStripeSession = {
        success: true,
        paymentStatus: 'failed',
        status: 'incomplete',
        paymentDetails: { method: 'card' },
      };
      const mockOrder = {
        publicId: 'order-1',
        status: OrderStatus.PENDING,
        items: [{ productVariationSizePublicId: 'stock-1', quantity: 2 }],
        user: { id: 1 },
      };
      const mockCancelledOrder = {
        ...mockOrder,
        status: OrderStatus.CANCELLED,
        paymentStatus: 'FAILED',
        notes: expect.stringContaining('Pedido cancelado'),
      };

      mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
        mockStripeSession,
      );
      mockOrderRepo.findOne.mockResolvedValue(mockOrder);
      mockOrderRepo.save.mockResolvedValue(mockCancelledOrder);
      mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
        publicId: 'stock-1',
      });
      mockStockService.adjustStock.mockResolvedValue(undefined);

      const result = await service.confirmOrder(1, 'order-1', 'session-123');

      expect(result).toHaveProperty('status', 'CANCELLED');
      expect(result).toHaveProperty('paymentStatus', 'FAILED');
    });

    it('should throw NotFoundException when order not found', async () => {
      const mockStripeSession = { success: true };
      mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
        mockStripeSession,
      );
      mockOrderRepo.findOne.mockResolvedValue(null);

      await expect(
        service.confirmOrder(1, 'non-existent', 'session-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateStockBeforeCheckout', () => {
    it('should validate stock successfully', async () => {
      const mockProductVariationSize = {
        productVariation: {
          product: { name: 'Test Product' },
          name: 'Test Variation',
          color: '#000000',
          price: 50,
        },
        size: 'M',
      };
      const mockStockItem = { quantity: 10 };

      mockProductVariationService.findProductVariationSizeWithRelations.mockResolvedValue(
        mockProductVariationSize,
      );
      mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
        mockStockItem,
      );

      const validateStockDto: ValidateStockDto = {
        items: [
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 5,
          },
        ],
      };

      const result =
        await service.validateStockBeforeCheckout(validateStockDto);

      expect(result).toHaveProperty('isValid', true);
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('totalAmount', 250);
      expect(result.message).toBe('Estoque disponível para todos os itens');
      expect(result.items[0]).toHaveProperty('isAvailable', true);
      expect(result.items[0]).toHaveProperty('availableQuantity', 10);
    });

    it('should fail validation with insufficient stock', async () => {
      const mockProductVariationSize = {
        productVariation: {
          product: { name: 'Test Product' },
          name: 'Test Variation',
          color: '#000000',
          price: 50,
        },
        size: 'M',
      };
      const mockStockItem = { quantity: 2 };

      mockProductVariationService.findProductVariationSizeWithRelations.mockResolvedValue(
        mockProductVariationSize,
      );
      mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
        mockStockItem,
      );

      const validateStockDto: ValidateStockDto = {
        items: [
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 5,
          },
        ],
      };

      const result =
        await service.validateStockBeforeCheckout(validateStockDto);

      expect(result).toHaveProperty('isValid', false);
      expect(result.message).toBe(
        'Alguns itens não possuem estoque suficiente',
      );
      expect(result.items[0]).toHaveProperty('isAvailable', false);
      expect(result.items[0]).toHaveProperty('availableQuantity', 2);
    });

    it('should throw BadRequestException when product not found', async () => {
      mockProductVariationService.findProductVariationSizeWithRelations.mockResolvedValue(
        null,
      );

      const validateStockDto: ValidateStockDto = {
        items: [
          {
            productVariationSizePublicId: 'non-existent',
            quantity: 1,
          },
        ],
      };

      await expect(
        service.validateStockBeforeCheckout(validateStockDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when stock item not found', async () => {
      const mockProductVariationSize = {
        productVariation: {
          product: { name: 'Test Product' },
          name: 'Test Variation',
          color: '#000000',
          price: 50,
        },
        size: 'M',
      };

      mockProductVariationService.findProductVariationSizeWithRelations.mockResolvedValue(
        mockProductVariationSize,
      );
      mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
        null,
      );

      const validateStockDto: ValidateStockDto = {
        items: [
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 1,
          },
        ],
      };

      await expect(
        service.validateStockBeforeCheckout(validateStockDto),
      ).rejects.toThrow(BadRequestException);
      expect(
        mockStockService.findStockItemByProductVariationSize,
      ).toHaveBeenCalledWith('test-size-1');
    });
  });

  describe('private methods', () => {
    describe('restoreStockAfterCancellation - edge cases', () => {
      it('should handle stock item not found during restoration', async () => {
        const items = [
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 1,
            productName: 'Test Product',
          },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
          null,
        );

        await (service as any).restoreStockAfterCancellation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(mockStockService.adjustStock).not.toHaveBeenCalled();
      });

      it('should handle stock adjustment error during restoration', async () => {
        const items = [
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 1,
            productName: 'Test Product',
            variationName: 'Variation',
            size: 'M',
          },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          publicId: 'stock-1',
        });
        mockStockService.adjustStock.mockRejectedValue(
          new Error('Adjustment error'),
        );

        await (service as any).restoreStockAfterCancellation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(mockStockService.adjustStock).toHaveBeenCalledWith(
          'stock-1',
          1,
          expect.stringContaining('Cancelamento'),
        );
      });

      it('should handle stock service error during restoration', async () => {
        const items = [
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 1,
            productName: 'Test Product',
          },
        ];

        mockStockService.findStockItemByProductVariationSize.mockRejectedValue(
          new Error('Stock service error'),
        );

        await (service as any).restoreStockAfterCancellation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(mockStockService.adjustStock).not.toHaveBeenCalled();
      });

      it('should handle empty items array during restoration', async () => {
        const items: any[] = [];

        await (service as any).restoreStockAfterCancellation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).not.toHaveBeenCalled();
        expect(mockStockService.adjustStock).not.toHaveBeenCalled();
      });

      it('should skip items without productVariationSizePublicId during restoration', async () => {
        const items = [
          {
            productVariationSizePublicId: null,
            quantity: 1,
            productName: 'Test Product 1',
          },
          {
            productVariationSizePublicId: undefined,
            quantity: 2,
            productName: 'Test Product 2',
          },
          {
            productVariationSizePublicId: '',
            quantity: 3,
            productName: 'Test Product 3',
          },
          {
            productVariationSizePublicId: 'test-size-1',
            quantity: 4,
            productName: 'Test Product 4',
          },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          publicId: 'stock-1',
        });
        mockStockService.adjustStock.mockResolvedValue(undefined);

        await (service as any).restoreStockAfterCancellation(items);

        // Deve chamar apenas para o item com productVariationSizePublicId válido
        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledTimes(1);
        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(mockStockService.adjustStock).toHaveBeenCalledTimes(1);
        expect(mockStockService.adjustStock).toHaveBeenCalledWith(
          'stock-1',
          4,
          expect.stringContaining('Cancelamento'),
        );
      });
    });

    describe('isPaymentSuccessful', () => {
      it('should return true for successful payment', () => {
        const stripeSession = {
          paymentStatus: 'paid',
          status: 'complete',
        };

        const result = (service as any).isPaymentSuccessful(stripeSession);

        expect(result).toBe(true);
      });

      it('should return false for failed payment', () => {
        const stripeSession = {
          paymentStatus: 'failed',
          status: 'incomplete',
        };

        const result = (service as any).isPaymentSuccessful(stripeSession);

        expect(result).toBe(false);
      });
    });

    describe('processSuccessfulPayment', () => {
      it('should process successful payment', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [],
        };
        const mockStripeSession = {
          paymentDetails: { method: 'card' },
        };
        const mockConfirmedOrder = {
          ...mockOrder,
          status: OrderStatus.CONFIRMED,
          paymentStatus: 'PAID',
          paymentMethodType: 'card',
          stripeSessionId: 'session-123',
        };

        mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
          mockStripeSession,
        );
        mockOrderRepo.save.mockResolvedValue(mockConfirmedOrder);

        const result = await (service as any).processSuccessfulPayment(
          mockOrder,
          'session-123',
        );

        expect(mockPaymentProvider.verifyPaymentStatus).toHaveBeenCalledWith(
          'session-123',
        );
        expect(mockOrderRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('status', 'CONFIRMED');
      });

      it('should process successful payment with null paymentDetails', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [],
        };
        const mockStripeSession = {
          paymentDetails: null, // Simula caso onde paymentDetails é null
        };
        const mockConfirmedOrder = {
          ...mockOrder,
          status: OrderStatus.CONFIRMED,
          paymentStatus: 'PAID',
          paymentMethodType: 'unknown', // Deve usar o fallback
          stripeSessionId: 'session-123',
        };

        mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
          mockStripeSession,
        );
        mockOrderRepo.save.mockResolvedValue(mockConfirmedOrder);

        const result = await (service as any).processSuccessfulPayment(
          mockOrder,
          'session-123',
        );

        expect(mockPaymentProvider.verifyPaymentStatus).toHaveBeenCalledWith(
          'session-123',
        );
        expect(mockOrderRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('status', 'CONFIRMED');
        expect(result).toHaveProperty('paymentMethodType', 'unknown');
      });

      it('should process successful payment with undefined paymentDetails', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [],
        };
        const mockStripeSession = {
          // paymentDetails não está definido
        };
        const mockConfirmedOrder = {
          ...mockOrder,
          status: OrderStatus.CONFIRMED,
          paymentStatus: 'PAID',
          paymentMethodType: 'unknown', // Deve usar o fallback
          stripeSessionId: 'session-123',
        };

        mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
          mockStripeSession,
        );
        mockOrderRepo.save.mockResolvedValue(mockConfirmedOrder);

        const result = await (service as any).processSuccessfulPayment(
          mockOrder,
          'session-123',
        );

        expect(mockPaymentProvider.verifyPaymentStatus).toHaveBeenCalledWith(
          'session-123',
        );
        expect(mockOrderRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('status', 'CONFIRMED');
        expect(result).toHaveProperty('paymentMethodType', 'unknown');
      });
    });

    describe('processFailedPayment', () => {
      it('should process failed payment', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [{ productVariationSizePublicId: 'stock-1', quantity: 2 }],
        };
        const mockCancelledOrder = {
          ...mockOrder,
          status: OrderStatus.CANCELLED,
          paymentStatus: 'FAILED',
          notes: expect.stringContaining('Pedido cancelado'),
        };

        mockOrderRepo.save.mockResolvedValue(mockCancelledOrder);
        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          publicId: 'stock-1',
        });
        mockStockService.adjustStock.mockResolvedValue(undefined);

        const result = await (service as any).processFailedPayment(
          mockOrder,
          'session-123',
        );

        expect(mockOrderRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('status', 'CANCELLED');
        expect(result).toHaveProperty('paymentStatus', 'FAILED');
      });

      it('should handle stock restoration error gracefully', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [{ productVariationSizePublicId: 'stock-1', quantity: 2 }],
        };
        const mockCancelledOrder = {
          ...mockOrder,
          status: OrderStatus.CANCELLED,
          paymentStatus: 'FAILED',
          notes: expect.stringContaining('Pedido cancelado'),
        };

        mockOrderRepo.save.mockResolvedValue(mockCancelledOrder);
        mockStockService.findStockItemByProductVariationSize.mockRejectedValue(
          new Error('Stock service error'),
        );

        const result = await (service as any).processFailedPayment(
          mockOrder,
          'session-123',
        );

        expect(mockOrderRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('status', 'CANCELLED');
        expect(result).toHaveProperty('paymentStatus', 'FAILED');
      });

      it('should handle stock restoration error in restoreStockAfterCancellation', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [{ productVariationSizePublicId: 'stock-1', quantity: 2 }],
        };
        const mockCancelledOrder = {
          ...mockOrder,
          status: OrderStatus.CANCELLED,
          paymentStatus: 'FAILED',
          notes: expect.stringContaining('Pedido cancelado'),
        };

        mockOrderRepo.save.mockResolvedValue(mockCancelledOrder);
        // Mock para que restoreStockAfterCancellation lance um erro
        jest
          .spyOn(service as any, 'restoreStockAfterCancellation')
          .mockRejectedValue(new Error('Restore stock error'));

        const result = await (service as any).processFailedPayment(
          mockOrder,
          'session-123',
        );

        expect(mockOrderRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('status', 'CANCELLED');
        expect(result).toHaveProperty('paymentStatus', 'FAILED');
      });
    });

    describe('validateStockForOrderCreation', () => {
      it('should skip validation for items without productVariationSizePublicId', async () => {
        const items = [
          { productVariationSizePublicId: '', quantity: 2 },
          { productVariationSizePublicId: 'test-size-1', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          quantity: 10,
        });

        await (service as any).validateStockForOrderCreation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).not.toHaveBeenCalledWith('');
      });

      it('should skip validation for items with null productVariationSizePublicId', async () => {
        const items = [
          { productVariationSizePublicId: null, quantity: 2 },
          { productVariationSizePublicId: 'test-size-1', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          quantity: 10,
        });

        await (service as any).validateStockForOrderCreation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).not.toHaveBeenCalledWith(null);
      });

      it('should skip validation for items with undefined productVariationSizePublicId', async () => {
        const items = [
          { productVariationSizePublicId: undefined, quantity: 2 },
          { productVariationSizePublicId: 'test-size-1', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          quantity: 10,
        });

        await (service as any).validateStockForOrderCreation(items);

        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).toHaveBeenCalledWith('test-size-1');
        expect(
          mockStockService.findStockItemByProductVariationSize,
        ).not.toHaveBeenCalledWith(undefined);
      });

      it('should throw error when stock item is not found', async () => {
        const items = [
          { productVariationSizePublicId: 'non-existent', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
          null,
        );

        await expect(
          (service as any).validateStockForOrderCreation(items),
        ).rejects.toThrow(BadRequestException);
      });

      it('should throw error when stock is insufficient', async () => {
        const items = [
          { productVariationSizePublicId: 'test-size-1', quantity: 5 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          quantity: 2,
        });

        await expect(
          (service as any).validateStockForOrderCreation(items),
        ).rejects.toThrow(BadRequestException);
      });

      it('should handle stock service error', async () => {
        const items = [
          { productVariationSizePublicId: 'test-size-1', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockRejectedValue(
          new Error('Stock service error'),
        );

        await expect(
          (service as any).validateStockForOrderCreation(items),
        ).rejects.toThrow(Error);
      });
    });

    describe('reserveStockForOrder', () => {
      it('should skip reservation for items without productVariationSizePublicId', async () => {
        const items = [
          { productVariationSizePublicId: '', quantity: 2 },
          { productVariationSizePublicId: 'test-size-1', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          publicId: 'stock-1',
          quantity: 10,
        });
        mockStockService.adjustStock.mockResolvedValue(undefined);

        const result = await (service as any).reserveStockForOrder(items);

        expect(mockStockService.adjustStock).toHaveBeenCalledWith(
          'stock-1',
          -1,
          expect.stringContaining('Reserva'),
        );
        expect(result).toHaveLength(1);
      });

      it('should throw error when stock item is not found for reservation', async () => {
        const items = [
          { productVariationSizePublicId: 'non-existent', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue(
          null,
        );

        await expect(
          (service as any).reserveStockForOrder(items),
        ).rejects.toThrow(BadRequestException);
      });

      it('should throw error when stock is insufficient for reservation', async () => {
        const items = [
          { productVariationSizePublicId: 'test-size-1', quantity: 5 },
        ];

        mockStockService.findStockItemByProductVariationSize.mockResolvedValue({
          publicId: 'stock-1',
          quantity: 2,
        });

        await expect(
          (service as any).reserveStockForOrder(items),
        ).rejects.toThrow(BadRequestException);
      });

      it('should handle stock adjustment error and perform rollback', async () => {
        const items = [
          { productVariationSizePublicId: 'test-size-1', quantity: 1 },
        ];

        mockStockService.findStockItemByProductVariationSize
          .mockResolvedValueOnce({
            publicId: 'stock-1',
            quantity: 10,
          })
          .mockRejectedValueOnce(new Error('Adjustment error'));
        mockStockService.adjustStock.mockRejectedValue(
          new Error('Adjustment error'),
        );

        await expect(
          (service as any).reserveStockForOrder(items),
        ).rejects.toThrow(Error);

        expect(mockStockService.adjustStock).toHaveBeenCalled();
      });
    });

    describe('markAsCanceled', () => {
      it('should cancel order successfully', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [
            {
              productVariationSizePublicId: 'test-size-1',
              quantity: 2,
              productName: 'Test Product',
            },
          ],
        };

        mockOrderRepo.findOne.mockResolvedValue(mockOrder);
        mockOrderRepo.save.mockResolvedValue({
          ...mockOrder,
          status: OrderStatus.CANCELLED,
        });

        const result = await service.markAsCanceled('order-1', {
          notes: 'Cancelamento solicitado',
        });

        expect(result).toHaveProperty('status', 'CANCELLED');
        expect(mockOrderRepo.save).toHaveBeenCalled();
      });

      it('should continue cancellation even if stock restoration fails', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [
            {
              productVariationSizePublicId: 'test-size-1',
              quantity: 2,
              productName: 'Test Product',
            },
          ],
        };

        mockOrderRepo.findOne.mockResolvedValue(mockOrder);
        mockOrderRepo.save.mockResolvedValue({
          ...mockOrder,
          status: OrderStatus.CANCELLED,
        });

        // Mock para falhar na restauração de estoque
        mockStockService.findStockItemByProductVariationSize.mockRejectedValue(
          new Error('Stock restoration error'),
        );

        const result = await service.markAsCanceled('order-1', {
          notes: 'Cancelamento com erro no estoque',
        });

        expect(result).toHaveProperty('status', 'CANCELLED');
        expect(mockOrderRepo.save).toHaveBeenCalled();
      });
    });

    describe('updateOrderStatus', () => {
      it('should update order status successfully', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [],
        };

        mockOrderRepo.findOne.mockResolvedValue(mockOrder);
        mockOrderRepo.save.mockResolvedValue({
          ...mockOrder,
          status: OrderStatus.CONFIRMED,
        });

        const result = await service.updateOrderStatus('order-1', {
          status: OrderStatus.CONFIRMED,
          notes: 'Pedido confirmado',
        });

        expect(result).toHaveProperty('status', 'CONFIRMED');
        expect(mockOrderRepo.save).toHaveBeenCalled();
      });

      it('should throw error for invalid status transition', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.DELIVERED,
          items: [],
        };

        mockOrderRepo.findOne.mockResolvedValue(mockOrder);

        await expect(
          service.updateOrderStatus('order-1', {
            status: OrderStatus.PENDING,
            notes: 'Tentativa inválida',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('markAsShipped', () => {
      it('should mark order as shipped successfully', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PROCESSING,
          items: [],
        };

        mockOrderRepo.findOne.mockResolvedValue(mockOrder);
        mockOrderRepo.save.mockResolvedValue({
          ...mockOrder,
          status: OrderStatus.SHIPPED,
        });

        const result = await service.markAsShipped('order-1', {
          notes: 'Pedido enviado',
        });

        expect(result).toHaveProperty('status', 'SHIPPED');
        expect(mockOrderRepo.save).toHaveBeenCalled();
      });

      it('should throw error for invalid status transition to shipped', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [],
        };

        mockOrderRepo.findOne.mockResolvedValue(mockOrder);

        await expect(
          service.markAsShipped('order-1', {
            notes: 'Tentativa inválida',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('findOrderByPublicIdOrFail', () => {
      it('should throw NotFoundException when order not found', async () => {
        mockOrderRepo.findOne.mockResolvedValue(null);

        await expect(
          (service as any).findOrderByPublicIdOrFail('non-existent'),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('updateOrderStatusInternal', () => {
      it('should update order status without notes', async () => {
        const mockOrder = {
          publicId: 'order-1',
          status: OrderStatus.PENDING,
          items: [],
        };

        mockOrderRepo.save.mockResolvedValue({
          ...mockOrder,
          status: OrderStatus.CONFIRMED,
        });

        const result = await (service as any).updateOrderStatusInternal(
          mockOrder,
          OrderStatus.CONFIRMED,
        );

        expect(result).toHaveProperty('status', 'CONFIRMED');
        expect(mockOrderRepo.save).toHaveBeenCalledWith({
          ...mockOrder,
          status: OrderStatus.CONFIRMED,
        });
      });
    });

    describe('validateStatusTransition', () => {
      it('should throw error for invalid transition from DELIVERED', async () => {
        expect(() =>
          (service as any).validateStatusTransition(
            OrderStatus.DELIVERED,
            OrderStatus.PENDING,
          ),
        ).toThrow(BadRequestException);
      });

      it('should throw error for invalid transition from CANCELLED', async () => {
        expect(() =>
          (service as any).validateStatusTransition(
            OrderStatus.CANCELLED,
            OrderStatus.CONFIRMED,
          ),
        ).toThrow(BadRequestException);
      });

      it('should throw error for invalid transition from SHIPPED to PROCESSING', async () => {
        expect(() =>
          (service as any).validateStatusTransition(
            OrderStatus.SHIPPED,
            OrderStatus.PROCESSING,
          ),
        ).toThrow(BadRequestException);
      });
    });

    describe('confirmOrder error handling', () => {
      it('should handle stripe session verification failure', async () => {
        const mockStripeSession = { success: false };
        mockPaymentProvider.verifyPaymentStatus.mockResolvedValue(
          mockStripeSession,
        );

        await expect(
          service.confirmOrder(1, 'order-1', 'session-123'),
        ).rejects.toThrow('Erro ao verificar sessão do Stripe');
      });

      it('should handle stripe service error', async () => {
        mockPaymentProvider.verifyPaymentStatus.mockRejectedValue(
          new Error('Stripe service error'),
        );

        await expect(
          service.confirmOrder(1, 'order-1', 'session-123'),
        ).rejects.toThrow('Stripe service error');
      });
    });
  });
});
