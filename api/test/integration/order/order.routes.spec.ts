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
});
