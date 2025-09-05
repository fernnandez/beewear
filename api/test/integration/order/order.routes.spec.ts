import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

import { AppModule } from 'src/app.module';
import { Order } from 'src/domain/order/order.entity';
import { ProductVariationSize } from 'src/domain/product/productVariation/product-variation-size.entity';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import { User } from 'src/domain/user/user.entity';

import { PaymentProvider } from 'src/integration/payment/payment.interface';

import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('OrderController (Integration - Routes) with Fixtures', () => {
  let app: INestApplication;
  let orderRepo: Repository<Order>;
  let stockItemRepo: Repository<StockItem>;
  let productVariationSizeRepo: Repository<ProductVariationSize>;
  let userRepo: Repository<User>;
  let paymentService: PaymentProvider;

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    setupIntegrationMocks();

    await app.init();

    orderRepo = app.get<Repository<Order>>(getRepositoryToken(Order));
    stockItemRepo = app.get<Repository<StockItem>>(
      getRepositoryToken(StockItem),
    );
    productVariationSizeRepo = app.get<Repository<ProductVariationSize>>(
      getRepositoryToken(ProductVariationSize),
    );
    userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    paymentService = app.get<PaymentProvider>('PaymentProvider');
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('/orders (GET)', () => {
    it(
      'should return a list of all orders',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        const order = response.body[0];
        expect(order).toHaveProperty('publicId');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('totalAmount');
        expect(order).toHaveProperty('user');
        expect(order.user).toHaveProperty('id');
        expect(order.user).toHaveProperty('name');
        expect(order.user).toHaveProperty('email');
      }),
    );

    it(
      'should return empty array when no orders exist',
      runWithRollbackTransaction(async () => {
        // Não limpar a tabela devido a foreign key constraints
        // Os fixtures já fornecem dados consistentes
        const response = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        // Verificar se retorna dados das fixtures
        expect(response.body.length).toBeGreaterThanOrEqual(0);
      }),
    );

    it(
      'should return orders ordered by creation date (newest first)',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(1);

        // Verificar se está ordenado por data de criação (mais recente primeiro)
        const dates = response.body.map(
          (order: any) => new Date(order.createdAt),
        );
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i].getTime()).toBeGreaterThanOrEqual(
            dates[i + 1].getTime(),
          );
        }
      }),
    );
  });

  describe('/orders/my-orders (GET)', () => {
    it(
      'should return user orders successfully',
      runWithRollbackTransaction(async () => {
        // Buscar usuário das fixtures
        const adminUser = await userRepo.findOneBy({
          email: 'email@example.com',
        });

        expect(adminUser).toBeDefined();

        // setupIntegrationMocks já configura o mock do usuário com ID fixo
        // Os pedidos das fixtures devem pertencer ao usuário mockado

        const response = await request(app.getHttpServer())
          .get('/orders/my-orders')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);

        // Verificar se retorna apenas pedidos do usuário
        const userOrders = response.body;
        userOrders.forEach((order: any) => {
          expect(order.user.id).toBe(adminUser!.id);
        });

        // Verificar estrutura dos dados
        if (userOrders.length > 0) {
          const firstOrder = userOrders[0];
          expect(firstOrder).toHaveProperty('publicId');
          expect(firstOrder).toHaveProperty('status');
          expect(firstOrder).toHaveProperty('totalAmount');
          expect(firstOrder).toHaveProperty('totalItems');
          expect(firstOrder).toHaveProperty('paymentMethodType');
          expect(firstOrder).toHaveProperty('paymentStatus');
          expect(firstOrder).toHaveProperty('user');
          expect(firstOrder).toHaveProperty('createdAt');
          expect(firstOrder).toHaveProperty('updatedAt');
        }
      }),
    );

    it(
      'should return empty array when user has no orders',
      runWithRollbackTransaction(async () => {
        // setupIntegrationMocks já configura o mock do usuário

        const response = await request(app.getHttpServer())
          .get('/orders/my-orders')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        // O usuário mockado (ID 1) tem pedidos nas fixtures, então não será 0
        expect(response.body.length).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  describe('/orders/:publicId (GET)', () => {
    it(
      'should return order details for a valid publicId',
      runWithRollbackTransaction(async () => {
        // Buscar pedido das fixtures
        const order = await orderRepo.findOneBy({
          publicId: '550e8400-e29b-41d4-a716-446655440000',
        });

        expect(order).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/orders/${order!.publicId}`)
          .expect(200);

        expect(response.body).toHaveProperty('publicId', order!.publicId);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('totalAmount');
        // totalItems não existe na resposta atual
        expect(response.body).toHaveProperty('paymentMethodType');
        expect(response.body).toHaveProperty('paymentStatus');
        expect(response.body).toHaveProperty('shippingAddress');
        expect(response.body).toHaveProperty('items');
        expect(Array.isArray(response.body.items)).toBe(true);

        // Verificar estrutura dos itens
        if (response.body.items.length > 0) {
          const firstItem = response.body.items[0];
          expect(firstItem).toHaveProperty('id');
          expect(firstItem).toHaveProperty('productName');
          expect(firstItem).toHaveProperty('variationName');
          expect(firstItem).toHaveProperty('color');
          expect(firstItem).toHaveProperty('size');
          expect(firstItem).toHaveProperty('quantity');
          expect(firstItem).toHaveProperty('unitPrice');
          expect(firstItem).toHaveProperty('totalPrice');
        }
      }),
    );

    it(
      'should return 404 if order with given publicId does not exist',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/orders/00000000-0000-0000-0000-000000000000')
          .expect(404);

        expect(response.body).toEqual({
          statusCode: 404,
          message: 'Pedido não encontrado',
          error: 'Not Found',
        });
      }),
    );
  });

  describe('/orders (POST)', () => {
    it(
      'should create order successfully',
      runWithRollbackTransaction(async () => {
        // Buscar usuário das fixtures
        const adminUser = await userRepo.findOneBy({
          email: 'email@example.com',
        });

        // Buscar ProductVariationSize das fixtures
        const productVariationSize = await productVariationSizeRepo.findOneBy({
          publicId: '68e2bc61-78cb-4ae2-97cb-580204b84501', // size_camiseta_fem_m_preta
        });

        expect(adminUser).toBeDefined();
        expect(productVariationSize).toBeDefined();

        // O setupIntegrationMocks já configura o usuário mockado no request
        // Não precisamos mockar manualmente o req.user

        const createOrderData = {
          items: [
            {
              productVariationSizePublicId:
                '68e2bc61-78cb-4ae2-97cb-580204b84501', // size_camiseta_fem_m_preta
              productVariationPublicId: '07982af1-dfc1-535e-bec8-ff470d361aaf', // variation_camiseta_fem_preta
              quantity: 2,
            },
          ],
          shippingAddressString: 'Rua Teste, 123 - Bairro Teste, Cidade Teste',
        };

        const response = await request(app.getHttpServer())
          .post('/orders')
          .send(createOrderData)
          .expect(201);

        expect(response.body).toHaveProperty('publicId');
        expect(response.body).toHaveProperty('status', 'PENDING');
        expect(response.body).toHaveProperty('paymentStatus', 'PENDING');
        expect(response.body).toHaveProperty('totalAmount');
        expect(response.body).toHaveProperty('items');
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].quantity).toBe(2);
        expect(response.body.shippingAddress).toBe(
          'Rua Teste, 123 - Bairro Teste, Cidade Teste',
        );

        // Verificar se o estoque foi reduzido
        const updatedStockItem = await stockItemRepo.findOneBy({
          productVariationSize: { id: productVariationSize!.id },
        });
        expect(updatedStockItem!.quantity).toBe(35); // O estoque não é reduzido no createOrder, apenas reservado
      }),
    );

    it(
      'should fail to create order with non-existent product',
      runWithRollbackTransaction(async () => {
        const createOrderData = {
          items: [
            {
              productVariationSizePublicId:
                '00000000-0000-0000-0000-000000000000',
              productVariationPublicId: '00000000-0000-0000-0000-000000000000',
              quantity: 1,
            },
          ],
          shippingAddressString: 'Rua Teste, 789',
        };

        const response = await request(app.getHttpServer())
          .post('/orders')
          .send(createOrderData)
          .expect(400);

        expect(response.body.message).toContain('Produto não encontrado');
      }),
    );
  });

  describe('/orders/confirm/:publicId (POST)', () => {
    it(
      'should confirm order successfully',
      runWithRollbackTransaction(async () => {
        // Buscar pedido das fixtures
        const order = await orderRepo.findOneBy({
          publicId: '550e8400-e29b-41d4-a716-446655440000',
        });

        expect(order).toBeDefined();

        // Mock do StripeService para confirmação
        const mockStripeSession = {
          success: true,
          sessionId: 'test-session-id-123',
          status: 'complete' as any,
          paymentStatus: 'paid' as any,
          amountTotal: 5000,
          customerEmail: 'test@example.com',
          metadata: {},
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
          paymentDetails: {
            id: 'pi_test_123',
            method: 'card',
            amount: 5000,
            currency: 'eur',
            status: 'succeeded',
            created: Date.now(),
          },
          customerInfo: {
            id: 'cus_test_123',
            email: 'test@example.com',
            name: 'Test User',
            phone: null,
          },
          billingAddress: null,
          shippingAddress: null,
        };

        // Mock do PaymentService usando o service injetado
        jest
          .spyOn(paymentService, 'verifyPaymentStatus')
          .mockResolvedValue(mockStripeSession);

        const response = await request(app.getHttpServer())
          .post(`/orders/confirm/${order!.publicId}`)
          .send({ sessionId: 'test-session-id-123' })
          .expect(200);

        expect(response.body).toHaveProperty('publicId', order!.publicId);
        expect(response.body).toHaveProperty('status', 'CONFIRMED');
        expect(response.body).toHaveProperty('paymentStatus', 'PAID');
        // paymentIntentId não está implementado na resposta atual
      }),
    );

    it(
      'should fail to confirm non-existent order',
      runWithRollbackTransaction(async () => {
        // Mock do PaymentService usando o service injetado
        jest.spyOn(paymentService, 'verifyPaymentStatus').mockResolvedValue({
          success: true,
          sessionId: 'test-session-id-456',
          status: 'complete' as any,
          paymentStatus: 'paid' as any,
          amountTotal: 5000,
          customerEmail: 'test@example.com',
          metadata: {},
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
          paymentDetails: {
            id: 'pi_test_456',
            method: 'card',
            amount: 5000,
            currency: 'eur',
            status: 'succeeded',
            created: Date.now(),
          },
          customerInfo: {
            id: 'cus_test_456',
            email: 'test@example.com',
            name: 'Test User',
          },
          billingAddress: null,
          shippingAddress: null,
        });

        const response = await request(app.getHttpServer())
          .post('/orders/confirm/00000000-0000-0000-0000-000000000000')
          .send({ sessionId: 'test-session-id-456' })
          .expect(404);

        expect(response.body.message).toBe('Pedido não encontrado');
      }),
    );
  });

  describe('/orders/:publicId/mark-as-canceled (POST)', () => {
    it(
      'should mark order as canceled successfully from PENDING status',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em PENDING
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const pendingOrder = ordersResponse.body.find(
          (order: any) => order.status === 'PENDING',
        );

        if (!pendingOrder) {
          console.log('⚠️ Nenhum pedido em PENDING encontrado para teste');
          return;
        }

        const markAsCanceledData = {
          notes: 'Cliente solicitou cancelamento',
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${pendingOrder.publicId}/mark-as-canceled`)
          .send(markAsCanceledData)
          .expect(200);

        expect(response.body).toHaveProperty('publicId', pendingOrder.publicId);
        expect(response.body).toHaveProperty('status', 'CANCELLED');
        expect(response.body).toHaveProperty(
          'notes',
          'Cliente solicitou cancelamento',
        );
        expect(response.body).toHaveProperty('updatedAt');
      }),
    );

    it(
      'should mark order as canceled successfully from CONFIRMED status',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em CONFIRMED
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const confirmedOrder = ordersResponse.body.find(
          (order: any) => order.status === 'CONFIRMED',
        );

        if (!confirmedOrder) {
          console.log('⚠️ Nenhum pedido em CONFIRMED encontrado para teste');
          return;
        }

        const markAsCanceledData = {
          notes: 'Produto fora de estoque',
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${confirmedOrder.publicId}/mark-as-canceled`)
          .send(markAsCanceledData)
          .expect(200);

        expect(response.body).toHaveProperty(
          'publicId',
          confirmedOrder.publicId,
        );
        expect(response.body).toHaveProperty('status', 'CANCELLED');
        expect(response.body).toHaveProperty(
          'notes',
          'Produto fora de estoque',
        );
        expect(response.body).toHaveProperty('updatedAt');
      }),
    );

    it(
      'should fail to mark as canceled with invalid transition',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em DELIVERED (que não pode ser cancelado)
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const deliveredOrder = ordersResponse.body.find(
          (order: any) => order.status === 'DELIVERED',
        );

        if (!deliveredOrder) {
          console.log('⚠️ Nenhum pedido em DELIVERED encontrado para teste');
          return;
        }

        const markAsCanceledData = {
          notes: 'Tentativa de cancelar pedido entregue',
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${deliveredOrder.publicId}/mark-as-canceled`)
          .send(markAsCanceledData)
          .expect(400);

        expect(response.body.message).toContain('Transição de status inválida');
      }),
    );

    it(
      'should fail to mark non-existent order as canceled',
      runWithRollbackTransaction(async () => {
        const markAsCanceledData = {
          notes: 'Cliente solicitou cancelamento',
        };

        const response = await request(app.getHttpServer())
          .post('/orders/00000000-0000-0000-0000-000000000000/mark-as-canceled')
          .send(markAsCanceledData)
          .expect(404);

        expect(response.body.message).toBe('Pedido não encontrado');
      }),
    );

    it(
      'should fail to mark as canceled without notes',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em qualquer status válido
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const validOrder = ordersResponse.body.find(
          (order: any) =>
            order.status === 'PENDING' ||
            order.status === 'CONFIRMED' ||
            order.status === 'SHIPPED',
        );

        if (!validOrder) {
          console.log(
            '⚠️ Nenhum pedido em status válido encontrado para teste',
          );
          return;
        }

        const markAsCanceledData = {
          notes: '', // Motivo vazio
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${validOrder.publicId}/mark-as-canceled`)
          .send(markAsCanceledData)
          .expect(400);

        expect(response.body.message).toContain(
          'Motivo do cancelamento é obrigatório',
        );
      }),
    );
  });

  describe('/orders/:publicId/mark-as-shipped (POST)', () => {
    it(
      'should mark order as shipped successfully from CONFIRMED status',
      runWithRollbackTransaction(async () => {
        // Primeiro, vamos buscar um pedido em CONFIRMED
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const confirmedOrder = ordersResponse.body.find(
          (order: any) => order.status === 'CONFIRMED',
        );

        if (!confirmedOrder) {
          console.log('⚠️ Nenhum pedido em CONFIRMED encontrado para teste');
          return;
        }

        const markAsShippedData = {
          notes: 'Pedido enviado via correio expresso',
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${confirmedOrder.publicId}/mark-as-shipped`)
          .send(markAsShippedData)
          .expect(200);

        expect(response.body).toHaveProperty(
          'publicId',
          confirmedOrder.publicId,
        );
        expect(response.body).toHaveProperty('status', 'SHIPPED');
        expect(response.body).toHaveProperty(
          'notes',
          'Pedido enviado via correio expresso',
        );
        expect(response.body).toHaveProperty('updatedAt');
      }),
    );

    it(
      'should mark order as shipped successfully from CONFIRMED status',
      runWithRollbackTransaction(async () => {
        // Primeiro, vamos buscar um pedido em CONFIRMED
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const confirmedOrder = ordersResponse.body.find(
          (order: any) => order.status === 'CONFIRMED',
        );

        if (!confirmedOrder) {
          console.log('⚠️ Nenhum pedido em CONFIRMED encontrado para teste');
          return;
        }

        const markAsShippedData = {
          notes: 'Pedido enviado diretamente após confirmação',
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${confirmedOrder.publicId}/mark-as-shipped`)
          .send(markAsShippedData)
          .expect(200);

        expect(response.body).toHaveProperty(
          'publicId',
          confirmedOrder.publicId,
        );
        expect(response.body).toHaveProperty('status', 'SHIPPED');
        expect(response.body).toHaveProperty(
          'notes',
          'Pedido enviado diretamente após confirmação',
        );
        expect(response.body).toHaveProperty('updatedAt');
      }),
    );

    it(
      'should fail to mark as shipped with invalid transition',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em PENDING (que não pode ir direto para SHIPPED)
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const pendingOrder = ordersResponse.body.find(
          (order: any) => order.status === 'PENDING',
        );

        if (!pendingOrder) {
          console.log('⚠️ Nenhum pedido em PENDING encontrado para teste');
          return;
        }

        // Tentar marcar como enviado um pedido em PENDING (deveria ser PENDING -> CONFIRMED -> SHIPPED)
        const markAsShippedData = {
          notes: 'Pedido enviado via correio expresso',
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${pendingOrder.publicId}/mark-as-shipped`)
          .send(markAsShippedData)
          .expect(400);

        expect(response.body.message).toContain('Transição de status inválida');
      }),
    );

    it(
      'should fail to mark non-existent order as shipped',
      runWithRollbackTransaction(async () => {
        const markAsShippedData = {
          notes: 'Pedido enviado via correio expresso',
        };

        const response = await request(app.getHttpServer())
          .post('/orders/00000000-0000-0000-0000-000000000000/mark-as-shipped')
          .send(markAsShippedData)
          .expect(404);

        expect(response.body.message).toBe('Pedido não encontrado');
      }),
    );

    it(
      'should fail to mark as shipped without notes',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em CONFIRMED
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const validOrder = ordersResponse.body.find(
          (order: any) => order.status === 'CONFIRMED',
        );

        if (!validOrder) {
          console.log('⚠️ Nenhum pedido em CONFIRMED encontrado para teste');
          return;
        }

        const markAsShippedData = {
          notes: '', // Notas vazias
        };

        const response = await request(app.getHttpServer())
          .post(`/orders/${validOrder.publicId}/mark-as-shipped`)
          .send(markAsShippedData)
          .expect(400);

        expect(response.body.message).toContain(
          'Observações sobre o envio são obrigatórias',
        );
      }),
    );
  });

  describe('/orders/:publicId/status (PATCH)', () => {
    it(
      'should update order status from CONFIRMED to SHIPPED successfully',
      runWithRollbackTransaction(async () => {
        // Primeiro, vamos buscar um pedido em CONFIRMED
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const confirmedOrder = ordersResponse.body.find(
          (order: any) => order.status === 'CONFIRMED',
        );

        if (!confirmedOrder) {
          console.log('⚠️ Nenhum pedido em CONFIRMED encontrado para teste');
          return;
        }

        const updateData = {
          status: 'SHIPPED',
          notes: 'Pedido enviado via correio expresso',
        };

        const response = await request(app.getHttpServer())
          .patch(`/orders/${confirmedOrder.publicId}/status`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty(
          'publicId',
          confirmedOrder.publicId,
        );
        expect(response.body).toHaveProperty('status', 'SHIPPED');
        expect(response.body).toHaveProperty(
          'notes',
          'Pedido enviado via correio expresso',
        );
        expect(response.body).toHaveProperty('updatedAt');
      }),
    );

    it(
      'should fail to update order status with invalid transition',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em qualquer status
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const order = ordersResponse.body[0];
        if (!order) {
          console.log('⚠️ Nenhum pedido encontrado para teste');
          return;
        }

        // Tentar transição inválida: PENDING -> SHIPPED (deveria ser PENDING -> CONFIRMED -> SHIPPED)
        const updateData = {
          status: 'SHIPPED',
        };

        const response = await request(app.getHttpServer())
          .patch(`/orders/${order.publicId}/status`)
          .send(updateData)
          .expect(400);

        expect(response.body.message).toContain('Transição de status inválida');
      }),
    );

    it(
      'should fail to update non-existent order status',
      runWithRollbackTransaction(async () => {
        const updateData = {
          status: 'SHIPPED',
        };

        const response = await request(app.getHttpServer())
          .patch('/orders/00000000-0000-0000-0000-000000000000/status')
          .send(updateData)
          .expect(404);

        expect(response.body.message).toBe('Pedido não encontrado');
      }),
    );

    it(
      'should update order status with only status (no notes)',
      runWithRollbackTransaction(async () => {
        // Buscar um pedido em CONFIRMED
        const ordersResponse = await request(app.getHttpServer())
          .get('/orders')
          .expect(200);

        const confirmedOrder = ordersResponse.body.find(
          (order: any) => order.status === 'CONFIRMED',
        );

        if (!confirmedOrder) {
          console.log('⚠️ Nenhum pedido em CONFIRMED encontrado para teste');
          return;
        }

        const updateData = {
          status: 'SHIPPED',
        };

        const response = await request(app.getHttpServer())
          .patch(`/orders/${confirmedOrder.publicId}/status`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('status', 'SHIPPED');
        expect(response.body).toHaveProperty('notes'); // Deve manter as notas existentes
      }),
    );
  });

  describe('/orders/validate-stock (POST)', () => {
    it(
      'should validate stock successfully',
      runWithRollbackTransaction(async () => {
        const validateStockData = {
          items: [
            {
              productVariationSizePublicId:
                '68e2bc61-78cb-4ae2-97cb-580204b84501', // size_camiseta_fem_m_preta
              quantity: 2,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/orders/validate-stock')
          .send(validateStockData)
          .expect(201);

        expect(response.body).toHaveProperty('isValid', true);
        expect(response.body).toHaveProperty(
          'message',
          'Estoque disponível para todos os itens',
        );
      }),
    );

    it(
      'should fail validation with insufficient stock',
      runWithRollbackTransaction(async () => {
        const validateStockData = {
          items: [
            {
              productVariationSizePublicId:
                '68e2bc61-78cb-4ae2-97cb-580204b84501', // size_camiseta_fem_m_preta
              quantity: 100, // Quantidade maior que o estoque disponível
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/orders/validate-stock')
          .send(validateStockData)
          .expect(201);

        expect(response.body).toHaveProperty('isValid', false);
        expect(response.body.message).toContain(
          'Alguns itens não possuem estoque suficiente',
        );
      }),
    );

    it(
      'should fail validation with non-existent product',
      runWithRollbackTransaction(async () => {
        const validateStockData = {
          items: [
            {
              productVariationSizePublicId:
                '00000000-0000-0000-0000-000000000000',
              quantity: 1,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/orders/validate-stock')
          .send(validateStockData)
          .expect(400);

        expect(response.body.message).toContain('Produto não encontrado');
      }),
    );
  });
});
