import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../../../src/domain/order/enums/order-status.enum';
import { OrderCleanupService } from '../../../../src/domain/order/order-cleanup.service';
import { Order } from '../../../../src/domain/order/order.entity';
import { OrderService } from '../../../../src/domain/order/order.service';

describe('OrderCleanupService', () => {
  let service: OrderCleanupService;
  let orderRepository: jest.Mocked<Repository<Order>>;
  let orderService: jest.Mocked<OrderService>;

  const mockOrderRepository = {
    find: jest.fn(),
  };

  const mockOrderService = {
    markAsCanceled: jest.fn(),
  };

  const createMockOrderResponse = (publicId: string) => ({
    publicId,
    status: OrderStatus.CANCELLED,
    totalAmount: 100,
    shippingCost: 10,
    shippingAddress: 'Test Address',
    paymentMethodType: 'credit_card',
    paymentStatus: 'pending',
    paymentIntentId: 'pi_test',
    notes: 'Test notes',
    items: [],
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCleanupService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    service = module.get<OrderCleanupService>(OrderCleanupService);
    orderRepository = module.get(getRepositoryToken(Order));
    orderService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cancelAbandonedOrders', () => {
    const createMockOrder = (
      id: string,
      createdAt: Date,
      status: OrderStatus = OrderStatus.PENDING,
    ) =>
      ({
        id: 1,
        publicId: id,
        status,
        createdAt,
        items: [],
      }) as any;

    it('should log start message and return early when no pending orders found', async () => {
      // Arrange
      orderRepository.find.mockResolvedValue([]);
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: { status: OrderStatus.PENDING },
        relations: ['items'],
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Iniciando limpeza de pedidos abandonados...',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Nenhum pedido abandonado encontrado',
      );
      expect(orderService.markAsCanceled).not.toHaveBeenCalled();
    });

    it('should return early when no abandoned orders found (all orders are recent)', async () => {
      // Arrange
      const now = DateTime.now();
      const recentOrder = createMockOrder(
        'order-1',
        now.minus({ minutes: 2 }).toJSDate(),
      );

      orderRepository.find.mockResolvedValue([recentOrder]);
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Total de pedidos pendentes encontrados: 1',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Nenhum pedido abandonado encontrado',
      );
      expect(orderService.markAsCanceled).not.toHaveBeenCalled();
    });

    it('should cancel abandoned orders successfully', async () => {
      // Arrange
      const now = DateTime.now();
      const abandonedOrder1 = createMockOrder(
        'order-1',
        now.minus({ minutes: 10 }).toJSDate(),
      );
      const abandonedOrder2 = createMockOrder(
        'order-2',
        now.minus({ minutes: 15 }).toJSDate(),
      );
      const recentOrder = createMockOrder(
        'order-3',
        now.minus({ minutes: 2 }).toJSDate(),
      );

      orderRepository.find.mockResolvedValue([
        abandonedOrder1,
        abandonedOrder2,
        recentOrder,
      ]);
      orderService.markAsCanceled.mockResolvedValue(
        createMockOrderResponse('order-1'),
      );

      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Total de pedidos pendentes encontrados: 3',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Encontrados 2 pedidos abandonados para cancelar',
      );
      expect(orderService.markAsCanceled).toHaveBeenCalledTimes(2);
      expect(orderService.markAsCanceled).toHaveBeenCalledWith('order-1', {
        notes: expect.stringContaining(
          'Pedido cancelado automaticamente por abandono de sessão',
        ),
      });
      expect(orderService.markAsCanceled).toHaveBeenCalledWith('order-2', {
        notes: expect.stringContaining(
          'Pedido cancelado automaticamente por abandono de sessão',
        ),
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Limpeza concluída: 2/2 pedidos cancelados',
      );
    });

    it('should handle errors during individual order cancellation and continue processing', async () => {
      // Arrange
      const now = DateTime.now();
      const abandonedOrder1 = createMockOrder(
        'order-1',
        now.minus({ minutes: 10 }).toJSDate(),
      );
      const abandonedOrder2 = createMockOrder(
        'order-2',
        now.minus({ minutes: 15 }).toJSDate(),
      );

      orderRepository.find.mockResolvedValue([
        abandonedOrder1,
        abandonedOrder2,
      ]);
      orderService.markAsCanceled
        .mockResolvedValueOnce(createMockOrderResponse('order-1')) // First order succeeds
        .mockRejectedValueOnce(new Error('Database error')); // Second order fails

      const loggerSpy = jest.spyOn(service['logger'], 'log');
      const errorSpy = jest.spyOn(service['logger'], 'error');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(orderService.markAsCanceled).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Pedido order-1 cancelado com sucesso',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Erro ao cancelar pedido order-2:',
        'Database error',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Limpeza concluída: 1/2 pedidos cancelados',
      );
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      orderRepository.find.mockRejectedValue(repositoryError);

      const loggerSpy = jest.spyOn(service['logger'], 'log');
      const errorSpy = jest.spyOn(service['logger'], 'error');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Iniciando limpeza de pedidos abandonados...',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Erro durante a limpeza de pedidos abandonados:',
        repositoryError,
      );
      expect(orderService.markAsCanceled).not.toHaveBeenCalled();
    });

    it('should log detailed information about order processing', async () => {
      // Arrange
      const now = DateTime.now();
      const abandonedOrder = createMockOrder(
        'order-1',
        now.minus({ minutes: 10 }).toJSDate(),
      );

      orderRepository.find.mockResolvedValue([abandonedOrder]);
      orderService.markAsCanceled.mockResolvedValue(
        createMockOrderResponse('order-1'),
      );

      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Data atual (UTC):'),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Timestamp limite:'),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Pedido order-1: timestamp'),
      );
    });

    it('should handle edge case where order age is exactly 5 minutes', async () => {
      // Arrange
      const now = DateTime.now();
      const exactlyFiveMinutesOrder = createMockOrder(
        'order-1',
        now.minus({ minutes: 5 }).toJSDate(),
      );

      orderRepository.find.mockResolvedValue([exactlyFiveMinutesOrder]);
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Nenhum pedido abandonado encontrado',
      );
      expect(orderService.markAsCanceled).not.toHaveBeenCalled();
    });

    it('should handle mixed scenarios with both recent and abandoned orders', async () => {
      // Arrange
      const now = DateTime.now();
      const recentOrder1 = createMockOrder(
        'order-1',
        now.minus({ minutes: 2 }).toJSDate(),
      );
      const recentOrder2 = createMockOrder(
        'order-2',
        now.minus({ minutes: 4 }).toJSDate(),
      );
      const abandonedOrder1 = createMockOrder(
        'order-3',
        now.minus({ minutes: 6 }).toJSDate(),
      );
      const abandonedOrder2 = createMockOrder(
        'order-4',
        now.minus({ minutes: 10 }).toJSDate(),
      );

      orderRepository.find.mockResolvedValue([
        recentOrder1,
        recentOrder2,
        abandonedOrder1,
        abandonedOrder2,
      ]);
      orderService.markAsCanceled.mockResolvedValue(
        createMockOrderResponse('order-1'),
      );

      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.cancelAbandonedOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Total de pedidos pendentes encontrados: 4',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Encontrados 2 pedidos abandonados para cancelar',
      );
      expect(orderService.markAsCanceled).toHaveBeenCalledTimes(2);
      expect(orderService.markAsCanceled).toHaveBeenCalledWith(
        'order-3',
        expect.any(Object),
      );
      expect(orderService.markAsCanceled).toHaveBeenCalledWith(
        'order-4',
        expect.any(Object),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Limpeza concluída: 2/2 pedidos cancelados',
      );
    });
  });
});
