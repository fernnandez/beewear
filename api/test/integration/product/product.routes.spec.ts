import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { Collection } from 'src/domain/product/collection/collection.entity';
import { Product } from 'src/domain/product/product.entity';
import { StockMovement } from 'src/domain/product/stock/stock-movement.entity';

import { AppModule } from 'src/app.module';
import { CreateProductDto } from 'src/domain/product/dto/create-product.dto';
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
              images: [],
            },
            {
              name: 'Variação Verde',
              price: 150.0,
              color: '#000000',
              images: [],
            },
            {
              name: 'Variação Vermelho',
              price: 150.0,
              color: '#000000',
              images: [],
            },
          ],
        } as CreateProductDto;

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto);

        expect(response.status).toBe(201);
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

          expect(variationSizes).toHaveLength(Object.keys(Size).length);

          for (const size of Object.keys(Size) as Size[]) {
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
              images: [],
            },
            {
              name: 'Variação Verde',
              price: 150.0,
              color: '#000000',
              images: [],
            },
            {
              name: 'Variação Vermelho',
              price: 150.0,
              color: '#000000',
              images: [],
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
              images: [],
            },
            {
              name: 'Variação Verde',
              price: 150.0,
              color: '#000000',
              images: [],
            },
            {
              name: 'Variação Vermelho',
              price: 150.0,
              color: '#000000',
              images: [],
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
        );
      }),
    );
  });

  describe('/product (GET)', () => {
    it(
      'should return a list of all products',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/product')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        const product = response.body[0];
        expect(product).toHaveProperty('publicId');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('variations');
      }),
    );
  });

  describe('/product/:publicId (GET)', () => {
    it(
      'should return product details for a valid publicId',
      runWithRollbackTransaction(async () => {
        const existingProduct = await productRepo.findOneBy({
          name: 'Calça Jeans Masculina Slim Fit',
        });

        expect(existingProduct).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/product/${existingProduct!.publicId}`)
          .expect(200);

        expect(response.body).toHaveProperty(
          'publicId',
          existingProduct!.publicId,
        );
        expect(response.body).toHaveProperty('name', existingProduct!.name);
        expect(response.body).toHaveProperty('variations');
        expect(Array.isArray(response.body.variations)).toBe(true);
      }),
    );

    it(
      'should return 404 if product with given publicId does not exist',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/product/00000000-0000-0000-0000-000000000000')
          .expect(404);

        expect(response.body).toEqual({
          statusCode: 404,
          message: 'Produto não encontrado',
          error: 'Not Found',
        });
      }),
    );
  });

  describe('/product/:publicId/status (PATCH)', () => {
    it(
      'should update product status',
      runWithRollbackTransaction(async () => {
        const existingProduct = await productRepo.findOneBy({
          name: 'Calça Jeans Masculina Slim Fit',
        });

        expect(existingProduct).toBeDefined();

        const originalStatus = existingProduct!.active;

        const response = await request(app.getHttpServer())
          .patch(`/product/${existingProduct!.publicId}/status`)
          .send({ isActive: !originalStatus })
          .expect(200);

        expect(response.body.message).toBe(
          'Status da coleção atualizado com sucesso',
        );
        expect(response.body.data).toHaveProperty('active', !originalStatus);

        const updatedProduct = await productRepo.findOneBy({
          id: existingProduct!.id,
        });

        expect(updatedProduct).toBeDefined();
        expect(updatedProduct!.active).toBe(!originalStatus);
      }),
    );
    it(
      'should return 404 if product with given publicId does not exist',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .patch('/product/00000000-0000-0000-0000-000000000000/status')
          .send({ isActive: true })
          .expect(404);

        expect(response.body).toEqual({
          statusCode: 404,
          message: 'Produto não encontrado',
          error: 'Not Found',
        });
      }),
    );
  });

  describe('/product/:publicId (PATCH)', () => {
    it(
      'should update product name',
      runWithRollbackTransaction(async () => {
        const existingProduct = await productRepo.findOneBy({
          name: 'Calça Jeans Masculina Slim Fit',
        });

        expect(existingProduct).toBeDefined();

        const newName = 'Calça Jeans Masculina Skinny Atualizada';

        const response = await request(app.getHttpServer())
          .patch(`/product/${existingProduct!.publicId}`)
          .send({ name: newName })
          .expect(200);

        expect(response.body.message).toBe('Produto atualizado com sucesso');
        expect(response.body.data).toHaveProperty('name', newName);

        const updatedProduct = await productRepo.findOneBy({
          id: existingProduct!.id,
        });

        expect(updatedProduct).toBeDefined();
        expect(updatedProduct!.name).toBe(newName);
      }),
    );

    it(
      'should return 404 if product with given publicId does not exist',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .patch('/product/00000000-0000-0000-0000-000000000000')
          .send({ name: 'name test' })
          .expect(404);

        expect(response.body).toEqual({
          statusCode: 404,
          message: 'Produto não encontrado',
          error: 'Not Found',
        });
      }),
    );
  });

  describe('/product/:publicId (DELETE)', () => {
    it(
      'should delete a product by publicId',
      runWithRollbackTransaction(async () => {
        const existingProduct = await productRepo.findOneBy({
          name: 'Calça Jeans Masculina Slim Fit',
        });

        expect(existingProduct).toBeDefined();

        const response = await request(app.getHttpServer())
          .delete(`/product/${existingProduct!.publicId}`)
          .expect(200);

        expect(response.body.message).toBe('Produto excluido com sucesso');

        const deletedProduct = await productRepo.findOneBy({
          id: existingProduct!.id,
        });

        expect(deletedProduct).toBeNull();
      }),
    );

    it(
      'should return 404 if product with given publicId does not exist',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .delete('/product/00000000-0000-0000-0000-000000000000')
          .expect(404);

        expect(response.body).toEqual({
          statusCode: 404,
          message: 'Produto não encontrado',
          error: 'Not Found',
        });
      }),
    );
  });

  describe('/product/dashboard/stock (GET)', () => {
    it(
      'should return stock dashboard summary and alerts',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/product/dashboard/stock')
          .expect(200);

        const body = response.body;

        expect(body).toHaveProperty('summary');
        expect(body.summary).toHaveProperty('totalProducts');
        expect(body.summary).toHaveProperty('totalValue');
        expect(body.summary).toHaveProperty('lowStockCount');
        expect(body.summary).toHaveProperty('noStockCount');

        expect(typeof body.summary.totalProducts).toBe('number');
        expect(typeof body.summary.totalValue).toBe('number');
        expect(typeof body.summary.lowStockCount).toBe('number');
        expect(typeof body.summary.noStockCount).toBe('number');

        expect(Array.isArray(body.lowStockAlerts)).toBe(true);
        expect(Array.isArray(body.noStockAlerts)).toBe(true);
        expect(Array.isArray(body.recentMovements)).toBe(true);

        if (body.recentMovements.length > 0) {
          const movement = body.recentMovements[0];
          expect(movement).toHaveProperty('productName');
          expect(movement).toHaveProperty('date');
          expect(movement).toHaveProperty('type');
          expect(movement).toHaveProperty('quantity');
        }
      }),
    );

    describe('GET /product/paginated', () => {
      it(
        'should return paginated products with default parameters',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated')
            .expect(200);

          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('totalPages');
          expect(response.body).toHaveProperty('page');
          expect(response.body).toHaveProperty('limit');
          expect(Array.isArray(response.body.data)).toBe(true);
        }),
      );

      it(
        'should handle pagination parameters correctly',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?page=1&limit=5')
            .expect(200);

          expect(response.body.page).toBe(1);
          expect(response.body.limit).toBe(5);
          expect(response.body.data.length).toBeLessThanOrEqual(5);
        }),
      );

      it(
        'should filter products by search term',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?search=Produto')
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);
        }),
      );

      it(
        'should filter products by active status (true)',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?active=true')
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);

          // Verificar que todos os produtos retornados estão ativos
          response.body.data.forEach((product: any) => {
            expect(product.active).toBe(true);
          });
        }),
      );

      it(
        'should filter products by active status (false)',
        runWithRollbackTransaction(async () => {
          // Desativar todos os produtos primeiro
          await productRepo.update({ active: true }, { active: false });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?active=false')
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);

          // Verificar que todos os produtos retornados estão inativos
          response.body.data.forEach((product: any) => {
            expect(product.active).toBe(false);
          });
        }),
      );

      it(
        'should filter products by collection',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          // Buscar uma coleção existente
          const existingCollection = await collectionRepo.findOneBy({
            name: 'Roupas Masculinas',
          });

          expect(existingCollection).toBeDefined();

          const response = await request(app.getHttpServer())
            .get(
              `/product/paginated?collectionId=${existingCollection!.publicId}`,
            )
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);

          // Verificar que todos os produtos retornados pertencem à coleção especificada
          response.body.data.forEach((product: any) => {
            expect(product.collection.publicId).toBe(
              existingCollection!.publicId,
            );
          });
        }),
      );

      it(
        'should sort products by name in ascending order',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?sortBy=name&sortOrder=ASC')
            .expect(200);

          expect(response.body.data.length).toBeGreaterThan(1);

          // Verificar se os produtos estão ordenados por nome (A-Z)
          for (let i = 0; i < response.body.data.length - 1; i++) {
            const currentName = response.body.data[i].name.toLowerCase();
            const nextName = response.body.data[i + 1].name.toLowerCase();
            expect(currentName <= nextName).toBe(true);
          }
        }),
      );

      it(
        'should sort products by name in descending order',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?sortBy=name&sortOrder=DESC')
            .expect(200);

          expect(response.body.data.length).toBeGreaterThan(1);

          // Verificar se os produtos estão ordenados por nome (Z-A)
          for (let i = 0; i < response.body.data.length - 1; i++) {
            const currentName = response.body.data[i].name.toLowerCase();
            const nextName = response.body.data[i + 1].name.toLowerCase();
            expect(currentName >= nextName).toBe(true);
          }
        }),
      );

      it(
        'should sort products by price in ascending order',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?sortBy=price&sortOrder=ASC')
            .expect(200);

          expect(response.body.data.length).toBeGreaterThan(1);

          // Verificar se os produtos estão ordenados por preço (menor para maior)
          for (let i = 0; i < response.body.data.length - 1; i++) {
            const currentMinPrice = Math.min(
              ...response.body.data[i].variations.map((v: any) => v.price),
            );
            const nextMinPrice = Math.min(
              ...response.body.data[i + 1].variations.map((v: any) => v.price),
            );
            expect(currentMinPrice <= nextMinPrice).toBe(true);
          }
        }),
      );

      it(
        'should sort products by price in descending order',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?sortBy=price&sortOrder=DESC')
            .expect(200);

          expect(response.body.data.length).toBeGreaterThan(1);

          // Verificar se os produtos estão ordenados por preço (maior para menor)
          for (let i = 0; i < response.body.data.length - 1; i++) {
            const currentMinPrice = Math.min(
              ...response.body.data[i].variations.map((v: any) => v.price),
            );
            const nextMinPrice = Math.min(
              ...response.body.data[i + 1].variations.map((v: any) => v.price),
            );
            expect(currentMinPrice >= nextMinPrice).toBe(true);
          }
        }),
      );

      it(
        'should use default sorting when invalid sort parameters are provided',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?sortBy=invalidField&sortOrder=INVALID')
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);

          // Deve usar ordenação padrão por createdAt DESC
          expect(response.body.data.length).toBeGreaterThan(0);
        }),
      );

      it(
        'should handle multiple filters combined',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          // Buscar uma coleção existente
          const existingCollection = await collectionRepo.findOneBy({
            name: 'Roupas Masculinas',
          });

          expect(existingCollection).toBeDefined();

          const response = await request(app.getHttpServer())
            .get(
              `/product/paginated?active=true&collectionId=${existingCollection!.publicId}&search=Produto&sortBy=name&sortOrder=ASC`,
            )
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);

          // Verificar que todos os produtos retornados atendem aos critérios
          response.body.data.forEach((product: any) => {
            expect(product.active).toBe(true);
            expect(product.collection.publicId).toBe(
              existingCollection!.publicId,
            );
          });
        }),
      );

      it(
        'should handle undefined active parameter',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?active=undefined')
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);
        }),
      );

      it(
        'should handle empty active parameter',
        runWithRollbackTransaction(async () => {
          // Ativar todos os produtos primeiro
          await productRepo.update({ active: false }, { active: true });

          const response = await request(app.getHttpServer())
            .get('/product/paginated?active=')
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(Array.isArray(response.body.data)).toBe(true);
        }),
      );
    });
  });
});
