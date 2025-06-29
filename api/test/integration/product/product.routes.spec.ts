import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { Collection } from 'src/domain/product/collection/collection.entity';
import { Product } from 'src/domain/product/product.entity';
import { StockMovement } from 'src/domain/product/stock/stock-movement.entity';

import { AppModule } from 'src/app.module';
import { CreateProductDto } from 'src/domain/product/create-product.dto';
import {
  ProductVariationSize,
  Size,
} from 'src/domain/product/productVariation/product-variation-size.entity';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('ProductController (Integration - Routes) with Fixtures', () => {
  let app: INestApplication;
  let collectionRepo: Repository<Collection>;
  let productRepo: Repository<Product>;
  let productVariationSizeRepo: Repository<ProductVariationSize>;
  let stockMovementRepo: Repository<StockMovement>;

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    setupIntegrationMocks();

    await app.init();

    collectionRepo = app.get<Repository<Collection>>(
      getRepositoryToken(Collection),
    );
    productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
    productVariationSizeRepo = app.get<Repository<ProductVariationSize>>(
      getRepositoryToken(ProductVariationSize),
    );

    stockMovementRepo = app.get<Repository<StockMovement>>(
      getRepositoryToken(StockMovement),
    );
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('/product (POST)', () => {
    it(
      'should create a product with variations and initial stock (using fixture collection)',
      runWithRollbackTransaction(async () => {
        const existingCollection = await collectionRepo.findOneBy({
          name: 'Roupas Masculinas',
        });

        expect(existingCollection).toBeDefined();

        const createProductDto = {
          name: 'Produto Teste CTI-PC-001',
          active: true,
          collectionPublicId: existingCollection!.publicId,
          variations: [
            {
              name: 'Variação Azul',
              price: 150.0,
              color: '#000000',
              sizes: [Size.L, Size.M, Size.S],
            },
            {
              name: 'Variação Verde',
              price: 150.0,
              color: '#000000',
              sizes: [Size.L, Size.M, Size.S],
            },
            {
              name: 'Variação Vermelho',
              price: 150.0,
              color: '#000000',
              sizes: [Size.L, Size.M, Size.S],
            },
          ],
        } as CreateProductDto;

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(201);

        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(createProductDto.name);
        expect(response.body.collection.publicId).toBe(
          createProductDto.collectionPublicId,
        );

        // Verifique o produto e variações persistidos
        const createdProduct = await productRepo.findOne({
          where: { id: response.body.id },
          relations: ['variations'],
        });
        expect(createdProduct).toBeDefined();
        expect(createdProduct?.variations).toHaveLength(3); // Duas variações criadas

        // Verifique os itens de estoque para cada variação
        for (const variationData of createProductDto.variations) {
          const variation = createdProduct?.variations.find(
            (v) =>
              v.name === variationData.name && v.color === variationData.color,
          );
          expect(variation).toBeDefined();

          const variationSizes = await productVariationSizeRepo.find({
            where: { productVariation: { id: variation?.id } },
            relations: ['stock'],
          });

          expect(variationSizes).toHaveLength(variationData.sizes.length);

          for (const size of variationData.sizes) {
            const variationSize = variationSizes.find(
              (s) => s.size === (size as unknown as Size),
            );
            expect(variationSize).toBeDefined();
            expect(variationSize?.stock.quantity).toBe(0);

            const stockMovement = await stockMovementRepo.findOne({
              where: { stockItem: { id: variationSize?.stock.id } },
            });
            expect(stockMovement).toBeDefined();
            expect(stockMovement?.type).toBe('IN');
          }
        }
      }),
    );

    it(
      'should return 404 Not Found if collection not found',
      runWithRollbackTransaction(async () => {
        const createProductDto = {
          name: 'Produto Teste CTI-PC-001',
          active: true,
          collectionPublicId: '1e969714-dcb4-43a5-9466-d9c054397ea4', // Um ID que não existe
          variations: [
            {
              name: 'Variação Azul',
              price: 150.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
            {
              name: 'Variação Verde',
              price: 150.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
            {
              name: 'Variação Vermelho',
              price: 150.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
          ],
        } as CreateProductDto;

        await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Coleção não encontrada',
            error: 'Not Found',
          });

        // Verifique que nenhum produto EXTRA foi criado
        const productsAfterTest = await productRepo.find();
        // Assumindo que suas fixtures carregam 3 produtos e são revertidas
        // para esse estado para cada transação.
        expect(productsAfterTest).toHaveLength(3);
      }),
    );

    it(
      'should return 400 Bad Request if creation DTO is invalid (e.g., empty name)',
      runWithRollbackTransaction(async () => {
        const createProductDto = {
          name: '',
          active: true,
          collectionPublicId: (await collectionRepo.findOneBy({
            name: 'Roupas Masculinas',
          }))!.publicId,
          variations: [
            {
              name: 'Variação Azul',
              price: 150.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
            {
              name: 'Variação Verde',
              price: 150.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
            {
              name: 'Variação Vermelho',
              price: 150.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
          ],
        } as CreateProductDto;

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array);
        expect(response.body.message[0]).toContain('name should not be empty');
      }),
    );

    it(
      'should return 400 Bad Request if variations are invalid (e.g., negative price)',
      runWithRollbackTransaction(async () => {
        const existingCollection = await collectionRepo.findOneBy({
          name: 'Roupas Masculinas',
        });

        const createProductDto = {
          name: 'Produto Teste CTI-PC-001',
          active: true,
          collectionPublicId: existingCollection!.publicId,
          variations: [
            {
              name: 'Variação Azul',
              price: -10.0,
              color: '#000000',
              sizes: ['XS', 'S', 'L'],
            },
          ],
        } as CreateProductDto;

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array);
        expect(response.body.message[0]).toContain(
          'price must not be less than 0',
        ); // Ajuste conforme sua validação
      }),
    );
  });
});
