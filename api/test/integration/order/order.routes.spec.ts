import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

import { AppModule } from 'src/app.module';
import { Collection } from 'src/domain/product/collection/collection.entity';
import { Product } from 'src/domain/product/product.entity';
import { ProductVariation } from 'src/domain/product/productVariation/product-variation.entity';
import {
  ProductVariationSize,
  Size,
} from 'src/domain/product/productVariation/product-variation-size.entity';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import { User } from 'src/domain/user/user.entity';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('Order Routes (Integration)', () => {
  let app: INestApplication;
  let stockItemRepo: Repository<StockItem>;
  let productRepo: Repository<Product>;
  let productVariationRepo: Repository<ProductVariation>;
  let productVariationSizeRepo: Repository<ProductVariationSize>;
  let collectionRepo: Repository<Collection>;
  let userRepo!: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupIntegrationMocks();

    await app.init();

    stockItemRepo = app.get<Repository<StockItem>>(
      getRepositoryToken(StockItem),
    );
    productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
    productVariationRepo = app.get<Repository<ProductVariation>>(
      getRepositoryToken(ProductVariation),
    );
    productVariationSizeRepo = app.get<Repository<ProductVariationSize>>(
      getRepositoryToken(ProductVariationSize),
    );
    collectionRepo = app.get<Repository<Collection>>(
      getRepositoryToken(Collection),
    );

    userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders/validate-stock', () => {
    it('should validate stock successfully', async () => {
      runWithRollbackTransaction(async () => {
        // Criar coleção de teste
        const testCollection = await collectionRepo.save({
          name: 'Test Collection',
          description: 'Test Description',
        });

        // Criar produto de teste
        const testProduct = await productRepo.save({
          name: 'Test Product',
          active: true,
          collection: testCollection,
        });

        // Criar variação de produto de teste
        const testProductVariation = await productVariationRepo.save({
          name: 'Test Variation',
          color: 'Green',
          price: 79.99,
          images: ['test-image.jpg'],
          product: testProduct,
        });

        // Criar ProductVariationSize de teste
        const testProductVariationSize = await productVariationSizeRepo.save({
          publicId: 'test-size-789',
          size: Size.S,
          productVariation: testProductVariation,
        });

        // Criar item de estoque
        const testStockItem = await stockItemRepo.save({
          publicId: 'test-stock-789',
          quantity: 15,
          productVariationSize: testProductVariationSize,
        });

        const validateStockData = {
          items: [
            {
              productVariationSizePublicId: 'test-size-789',
              quantity: 5,
            },
          ],
        };

        const response = await app
          .getHttpServer()
          .post('/orders/validate-stock')
          .send(validateStockData);

        expect(response.status).toBe(201);
        expect(response.body.isValid).toBe(true);
        expect(response.body.totalAmount).toBeGreaterThan(0);
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].isAvailable).toBe(true);
      });
    });

    it('should fail validation when stock is insufficient', async () => {
      runWithRollbackTransaction(async () => {
        // Criar coleção de teste
        const testCollection = await collectionRepo.save({
          name: 'Test Collection 2',
          description: 'Test Description 2',
        });

        // Criar produto de teste
        const testProduct = await productRepo.save({
          name: 'Test Product 2',
          active: true,
          collection: testCollection,
        });

        // Criar variação de produto de teste
        const testProductVariation = await productVariationRepo.save({
          name: 'Test Variation 2',
          color: 'Blue',
          price: 149.99,
          images: ['test-image-2.jpg'],
          product: testProduct,
        });

        // Criar ProductVariationSize de teste
        const testProductVariationSize = await productVariationSizeRepo.save({
          publicId: 'test-size-456',
          size: Size.L,
          productVariation: testProductVariation,
        });

        // Criar item de estoque com quantidade baixa
        const lowStockQuantity = 2;
        await stockItemRepo.save({
          publicId: 'test-stock-456',
          quantity: lowStockQuantity,
          productVariationSize: testProductVariationSize,
        });

        const validateStockData = {
          items: [
            {
              productVariationSizePublicId: 'test-size-456',
              quantity: 5, // Maior que o estoque disponível
            },
          ],
        };

        const response = await app
          .getHttpServer()
          .post('/orders/validate-stock')
          .send(validateStockData);

        expect(response.status).toBe(201);
        expect(response.body.isValid).toBe(false);
        expect(response.body.message).toContain('Estoque insuficiente');
        expect(response.body.items[0].isAvailable).toBe(false);
      });
    });
  });

  describe('POST /orders', () => {
    it('should create order with PENDING status successfully', async () => {
      runWithRollbackTransaction(async () => {
        // Criar usuário de teste
        const testUser = await userRepo.save({
          email: 'test@example.com',
          password: 'hashedPassword',
          firstName: 'Test',
          lastName: 'User',
        });

        // Criar coleção de teste
        const testCollection = await collectionRepo.save({
          name: 'Test Collection for Order',
          description: 'Test Description for Order',
        });

        // Criar produto de teste
        const testProduct = await productRepo.save({
          name: 'Test Product for Order',
          active: true,
          collection: testCollection,
        });

        // Criar variação de produto de teste
        const testProductVariation = await productVariationRepo.save({
          name: 'Test Variation for Order',
          color: 'Red',
          price: 99.99,
          images: ['test-image-order.jpg'],
          product: testProduct,
        });

        // Criar ProductVariationSize de teste
        const testProductVariationSize = await productVariationSizeRepo.save({
          publicId: 'test-size-order-123',
          size: Size.M,
          productVariation: testProductVariation,
        });

        // Criar item de estoque
        await stockItemRepo.save({
          publicId: 'test-stock-order-123',
          quantity: 10,
          productVariationSize: testProductVariationSize,
        });

        const createOrderData = {
          items: [
            {
              productVariationSizePublicId: 'test-size-order-123',
              productVariationPublicId: 'test-variation-123',
              quantity: 2,
            },
          ],
          shippingAddressId: 1,
          shippingAddressString: 'Rua Teste, 123 - Bairro Teste, Cidade Teste',
          paymentMethodType: 'CREDIT_CARD',
          paymentMethodName: 'Cartão de Crédito',
          notes: 'Pedido de teste',
        };

        // Mock do usuário autenticado
        const mockUser = { id: testUser.id };
        jest.spyOn(app.get('REQUEST'), 'user', 'get').mockReturnValue(mockUser);

        const response = await app
          .getHttpServer()
          .post('/orders')
          .send(createOrderData);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('PENDING');
        expect(response.body.paymentStatus).toBe('PENDING');
        expect(response.body.totalAmount).toBe(199.98); // 99.99 * 2
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].quantity).toBe(2);
        expect(response.body.items[0].productName).toBe(
          'Test Product for Order',
        );
        expect(response.body.shippingAddress).toBe(
          'Rua Teste, 123 - Bairro Teste, Cidade Teste',
        );
        expect(response.body.paymentMethodType).toBe('CREDIT_CARD');
        expect(response.body.notes).toBe('Pedido de teste');
      });
    });

    it('should fail to create order with insufficient stock', async () => {
      runWithRollbackTransaction(async () => {
        // Criar usuário de teste
        const testUser = await userRepo.save({
          email: 'test2@example.com',
          password: 'hashedPassword',
          firstName: 'Test2',
          lastName: 'User2',
        });

        // Criar coleção de teste
        const testCollection = await collectionRepo.save({
          name: 'Test Collection for Order 2',
          description: 'Test Description for Order 2',
        });

        // Criar produto de teste
        const testProduct = await productRepo.save({
          name: 'Test Product for Order 2',
          active: true,
          collection: testCollection,
        });

        // Criar variação de produto de teste
        const testProductVariation = await productVariationRepo.save({
          name: 'Test Variation for Order 2',
          color: 'Blue',
          price: 149.99,
          images: ['test-image-order-2.jpg'],
          product: testProduct,
        });

        // Criar ProductVariationSize de teste
        const testProductVariationSize = await productVariationSizeRepo.save({
          publicId: 'test-size-order-456',
          size: Size.L,
          productVariation: testProductVariation,
        });

        // Criar item de estoque com quantidade baixa
        await stockItemRepo.save({
          publicId: 'test-stock-order-456',
          quantity: 1,
          productVariationSize: testProductVariationSize,
        });

        const createOrderData = {
          items: [
            {
              productVariationSizePublicId: 'test-size-order-456',
              productVariationPublicId: 'test-variation-456',
              quantity: 3, // Maior que o estoque disponível
            },
          ],
          shippingAddressId: 1,
          shippingAddressString:
            'Rua Teste 2, 456 - Bairro Teste 2, Cidade Teste 2',
          paymentMethodType: 'PIX',
          paymentMethodName: 'PIX',
        };

        // Mock do usuário autenticado
        const mockUser = { id: testUser.id };
        jest.spyOn(app.get('REQUEST'), 'user', 'get').mockReturnValue(mockUser);

        const response = await app
          .getHttpServer()
          .post('/orders')
          .send(createOrderData);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Estoque insuficiente');
      });
    });
  });
});
