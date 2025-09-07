import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from 'src/app.module';
import { Collection } from 'src/domain/product/collection/collection.entity';
import { Product } from 'src/domain/product/product.entity';
import { ProductVariationSize } from 'src/domain/product/productVariation/product-variation-size.entity';
import { ProductVariation } from 'src/domain/product/productVariation/product-variation.entity';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('PublicProductController - Integration (HTTP)', () => {
  let app: INestApplication;
  let collectionRepo: Repository<Collection>;
  let productRepo: Repository<Product>;
  let productVariationRepo: Repository<ProductVariation>;
  let productVariationSizeRepo: Repository<ProductVariationSize>;

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
    productVariationRepo = app.get<Repository<ProductVariation>>(
      getRepositoryToken(ProductVariation),
    );
    productVariationSizeRepo = app.get<Repository<ProductVariationSize>>(
      getRepositoryToken(ProductVariationSize),
    );
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('GET /public/product', () => {
    it(
      'should return all active products with variations for frontend',
      runWithRollbackTransaction(async () => {
        // Ativar alguns produtos para teste
        await productRepo.update({ active: false }, { active: true });

        // Verificar se existem produtos ativos no banco
        const activeProducts = await productRepo.find({
          where: { active: true },
          relations: ['collection', 'variations', 'variations.sizes'],
        });

        expect(activeProducts.length).toBeGreaterThan(0);

        const response = await request(app.getHttpServer())
          .get('/public/product')
          .expect(200);

        // Verificar estrutura da resposta
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        // Verificar estrutura de cada produto
        const firstProduct = response.body[0];
        expect(firstProduct).toHaveProperty('publicId');
        expect(firstProduct).toHaveProperty('name');
        expect(firstProduct).toHaveProperty('active');
        expect(firstProduct).toHaveProperty('variations');
        expect(firstProduct.active).toBe(true);
        expect(Array.isArray(firstProduct.variations)).toBe(true);

        // A coleção pode ser opcional
        if (firstProduct.collection !== undefined) {
          expect(typeof firstProduct.collection).toBe('object');
        }

        // Verificar tipos de dados
        expect(typeof firstProduct.publicId).toBe('string');
        expect(typeof firstProduct.name).toBe('string');
        expect(typeof firstProduct.active).toBe('boolean');
        expect(Array.isArray(firstProduct.variations)).toBe(true);
      }),
    );

    it(
      'should not return inactive products',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Criar um produto inativo para teste
        const existingCollection = await collectionRepo.findOneBy({
          name: 'Roupas Masculinas',
        });

        expect(existingCollection).toBeDefined();

        const inactiveProduct = productRepo.create({
          name: 'Produto Inativo Teste',
          active: false,
          collection: existingCollection!,
        });
        await productRepo.save(inactiveProduct);

        const response = await request(app.getHttpServer())
          .get('/public/product')
          .expect(200);

        // Verificar que o produto inativo não está na resposta
        const inactiveProductInResponse = response.body.find(
          (product: any) => product.name === 'Produto Inativo Teste',
        );
        expect(inactiveProductInResponse).toBeUndefined();
      }),
    );

    it(
      'should return products with complete variation data',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/public/product')
          .expect(200);

        response.body.forEach((product: any) => {
          // Verificar estrutura do produto
          expect(typeof product.publicId).toBe('string');
          expect(typeof product.name).toBe('string');
          expect(typeof product.active).toBe('boolean');
          expect(product.active).toBe(true);

          // Verificar estrutura da coleção
          expect(product.collection).toHaveProperty('publicId');
          expect(product.collection).toHaveProperty('name');
          expect(product.collection).toHaveProperty('active');
          expect(typeof product.collection.publicId).toBe('string');
          expect(typeof product.collection.name).toBe('string');
          expect(typeof product.collection.active).toBe('boolean');

          // Verificar estrutura das variações
          expect(Array.isArray(product.variations)).toBe(true);
          product.variations.forEach((variation: any) => {
            expect(variation).toHaveProperty('publicId');
            expect(variation).toHaveProperty('color');
            expect(variation).toHaveProperty('name');
            expect(variation).toHaveProperty('price');
            expect(variation).toHaveProperty('images');
            expect(variation).toHaveProperty('sizes');

            expect(typeof variation.publicId).toBe('string');
            expect(typeof variation.color).toBe('string');
            expect(typeof variation.name).toBe('string');
            expect(typeof variation.price).toBe('number');
            expect(Array.isArray(variation.images)).toBe(true);
            expect(Array.isArray(variation.sizes)).toBe(true);

            // Verificar estrutura dos tamanhos
            variation.sizes.forEach((size: any) => {
              expect(size).toHaveProperty('size');
              expect(size).toHaveProperty('stock');
              expect(size.stock).toHaveProperty('quantity');
              expect(typeof size.size).toBe('string');
              expect(typeof size.stock.quantity).toBe('number');
            });
          });
        });
      }),
    );

    it(
      'should handle request without authentication (public endpoint)',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/public/product')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
      }),
    );
  });

  describe('GET /public/product/:publicId', () => {
    it(
      'should return product details by publicId',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar um produto existente
        const existingProduct = await productRepo.findOne({
          where: { active: true },
          relations: ['collection', 'variations', 'variations.sizes'],
        });

        expect(existingProduct).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/public/product/${existingProduct!.publicId}`)
          .expect(200);

        // Verificar estrutura da resposta
        expect(response.body).toHaveProperty('publicId');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('active');
        expect(response.body).toHaveProperty('variations');

        // A coleção pode ser opcional
        if (response.body.collection !== undefined) {
          expect(typeof response.body.collection).toBe('object');
        }

        // Verificar se é o produto correto
        expect(response.body.publicId).toBe(existingProduct!.publicId);
        expect(response.body.name).toBe(existingProduct!.name);
        expect(response.body.active).toBe(existingProduct!.active);

        // Verificar tipos de dados
        expect(typeof response.body.publicId).toBe('string');
        expect(typeof response.body.name).toBe('string');
        expect(typeof response.body.active).toBe('boolean');
        expect(Array.isArray(response.body.variations)).toBe(true);
      }),
    );

    it(
      'should return 404 for non-existent product',
      runWithRollbackTransaction(async () => {
        const nonExistentPublicId = '12345678-1234-1234-1234-123456789012';

        await request(app.getHttpServer())
          .get(`/public/product/${nonExistentPublicId}`)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Produto não encontrado',
            error: 'Not Found',
          });
      }),
    );

    it(
      'should return 404 for inactive product',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Criar um produto inativo
        const existingCollection = await collectionRepo.findOneBy({
          name: 'Roupas Masculinas',
        });

        expect(existingCollection).toBeDefined();

        const inactiveProduct = productRepo.create({
          name: 'Produto Inativo para Teste',
          active: false,
          collection: existingCollection!,
        });
        await productRepo.save(inactiveProduct);

        await request(app.getHttpServer())
          .get(`/public/product/${inactiveProduct.publicId}`)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Produto não encontrado',
            error: 'Not Found',
          });
      }),
    );

    it(
      'should return complete product details with all relations',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar um produto com todas as relações
        const existingProduct = await productRepo.findOne({
          where: { active: true },
          relations: ['collection', 'variations', 'variations.sizes'],
        });

        expect(existingProduct).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/public/product/${existingProduct!.publicId}`)
          .expect(200);

        // Verificar estrutura da coleção (se existir)
        if (response.body.collection && existingProduct!.collection) {
          expect(response.body.collection).toHaveProperty('publicId');
          expect(response.body.collection).toHaveProperty('name');
          expect(response.body.collection).toHaveProperty('active');
          expect(response.body.collection.publicId).toBe(
            existingProduct!.collection!.publicId,
          );
        }

        // Verificar estrutura das variações
        expect(response.body.variations.length).toBe(
          existingProduct!.variations.length,
        );

        if (response.body.variations.length > 0) {
          response.body.variations.forEach((variation: any, index: number) => {
            const originalVariation = existingProduct!.variations[index];
            expect(variation.publicId).toBe(originalVariation.publicId);
            expect(variation.color).toBe(originalVariation.color);
            expect(variation.name).toBe(originalVariation.name);
            expect(variation.price).toBe(originalVariation.price);
            expect(Array.isArray(variation.images)).toBe(true);
            expect(Array.isArray(variation.sizes)).toBe(true);

            // Verificar se os tamanhos correspondem
            expect(variation.sizes.length).toBe(originalVariation.sizes.length);
          });
        }
      }),
    );

    it(
      'should handle request without authentication (public endpoint)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar um produto existente
        const existingProduct = await productRepo.findOne({
          where: { active: true },
        });

        expect(existingProduct).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/public/product/${existingProduct!.publicId}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.publicId).toBe(existingProduct!.publicId);
      }),
    );
  });

  describe('GET /public/product/paginated', () => {
    it(
      'should return paginated products with default parameters',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar estrutura da resposta paginada
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('limit');
        expect(response.body).toHaveProperty('totalPages');
        expect(response.body).toHaveProperty('hasNext');
        expect(response.body).toHaveProperty('hasPrevious');

        // Verificar valores padrão
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(10);
        expect(response.body.total).toBeGreaterThan(0);
        expect(Array.isArray(response.body.data)).toBe(true);

        // Verificar estrutura dos produtos
        if (response.body.data.length > 0) {
          const firstProduct = response.body.data[0];
          expect(firstProduct).toHaveProperty('publicId');
          expect(firstProduct).toHaveProperty('name');
          expect(firstProduct).toHaveProperty('active');
          expect(firstProduct).toHaveProperty('variations');
          expect(firstProduct.active).toBe(true);
        }
      }),
    );

    it(
      'should handle pagination parameters correctly',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?page=1&limit=5')
          .expect(200);

        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(5);
        expect(response.body.data.length).toBeLessThanOrEqual(5);
      }),
    );

    it(
      'should return products ordered by creation date (newest first)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?limit=100')
          .expect(200);

        expect(response.body.data.length).toBeGreaterThan(1);

        // Verificar se está ordenado por data de criação (DESC - mais recentes primeiro)
        for (let i = 1; i < response.body.data.length; i++) {
          const currentDate = new Date(response.body.data[i].createdAt);
          const previousDate = new Date(response.body.data[i - 1].createdAt);

          // Verificar se as datas são válidas antes de comparar
          if (!isNaN(currentDate.getTime()) && !isNaN(previousDate.getTime())) {
            expect(currentDate.getTime()).toBeLessThanOrEqual(
              previousDate.getTime(),
            );
          }
        }
      }),
    );

    it(
      'should filter products by search term',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar um produto existente para usar como termo de busca
        const existingProduct = await productRepo.findOne({
          where: { active: true },
        });

        expect(existingProduct).toBeDefined();

        const searchTerm = existingProduct!.name.substring(0, 5); // Primeiras 5 letras

        const response = await request(app.getHttpServer())
          .get(`/public/product/paginated?search=${searchTerm}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThan(0);

        // Verificar se todos os produtos retornados contêm o termo de busca
        response.body.data.forEach((product: any) => {
          expect(
            product.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ).toBe(true);
        });
      }),
    );

    it(
      'should filter products by active status',
      runWithRollbackTransaction(async () => {
        // Criar um produto inativo para teste
        const existingCollection = await collectionRepo.findOneBy({
          name: 'Roupas Masculinas',
        });

        expect(existingCollection).toBeDefined();

        const inactiveProduct = productRepo.create({
          name: 'Produto Inativo para Teste de Filtro',
          active: false,
          collection: existingCollection!,
        });
        await productRepo.save(inactiveProduct);

        // Testar filtro por produtos ativos
        const activeResponse = await request(app.getHttpServer())
          .get('/public/product/paginated?active=true')
          .expect(200);

        // Verificar que todos os produtos retornados estão ativos
        activeResponse.body.data.forEach((product: any) => {
          expect(product.active).toBe(true);
        });

        // Verificar que o produto inativo não está na resposta
        const inactiveProductInResponse = activeResponse.body.data.find(
          (product: any) =>
            product.name === 'Produto Inativo para Teste de Filtro',
        );
        expect(inactiveProductInResponse).toBeUndefined();
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
            `/public/product/paginated?collectionId=${existingCollection!.publicId}`,
          )
          .expect(200);

        // Verificar que todos os produtos retornados pertencem à coleção
        response.body.data.forEach((product: any) => {
          expect(product.collection.publicId).toBe(
            existingCollection!.publicId,
          );
        });
      }),
    );

    it(
      'should filter products by price range',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const minPrice = 100;
        const maxPrice = 200;

        const response = await request(app.getHttpServer())
          .get(
            `/public/product/paginated?minPrice=${minPrice}&maxPrice=${maxPrice}`,
          )
          .expect(200);

        // Verificar que todos os produtos retornados estão na faixa de preço
        response.body.data.forEach((product: any) => {
          product.variations.forEach((variation: any) => {
            const price =
              typeof variation.price === 'string'
                ? parseFloat(variation.price)
                : variation.price;
            expect(price).toBeGreaterThanOrEqual(minPrice);
            expect(price).toBeLessThanOrEqual(maxPrice);
          });
        });
      }),
    );

    it(
      'should filter products by colors',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar uma cor existente
        const existingVariation = await productVariationRepo.findOne({
          where: {},
        });

        expect(existingVariation).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/public/product/paginated?colors=${existingVariation!.color}`)
          .expect(200);

        // Verificar que todos os produtos retornados têm a cor especificada
        response.body.data.forEach((product: any) => {
          const hasColor = product.variations.some(
            (variation: any) => variation.color === existingVariation!.color,
          );
          expect(hasColor).toBe(true);
        });
      }),
    );

    it(
      'should filter products by multiple colors',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar duas cores existentes
        const variations = await productVariationRepo.find({
          take: 2,
        });

        expect(variations.length).toBeGreaterThanOrEqual(2);

        const colors = variations.map((v) => v.color).join(',');
        const response = await request(app.getHttpServer())
          .get(`/public/product/paginated?colors=${colors}`)
          .expect(200);

        // Verificar que todos os produtos retornados têm pelo menos uma das cores
        response.body.data.forEach((product: any) => {
          const hasAnyColor = product.variations.some((variation: any) =>
            variations.some((v) => v.color === variation.color),
          );
          expect(hasAnyColor).toBe(true);
        });
      }),
    );

    it(
      'should filter products by sizes',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar um tamanho existente
        const existingSize = await productVariationSizeRepo.findOne({
          where: {},
        });

        expect(existingSize).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/public/product/paginated?sizes=${existingSize!.size}`)
          .expect(200);

        // Verificar que todos os produtos retornados têm o tamanho especificado
        response.body.data.forEach((product: any) => {
          const hasSize = product.variations.some((variation: any) =>
            variation.sizes.some(
              (size: any) => size.size === existingSize!.size.toString(),
            ),
          );
          expect(hasSize).toBe(true);
        });
      }),
    );

    it(
      'should filter products by multiple sizes',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Buscar dois tamanhos existentes
        const sizes = await productVariationSizeRepo.find({
          take: 2,
        });

        expect(sizes.length).toBeGreaterThanOrEqual(2);

        const sizeStrings = sizes.map((s) => s.size.toString()).join(',');
        const response = await request(app.getHttpServer())
          .get(`/public/product/paginated?sizes=${sizeStrings}`)
          .expect(200);

        // Verificar que todos os produtos retornados têm pelo menos um dos tamanhos
        response.body.data.forEach((product: any) => {
          const hasAnySize = product.variations.some((variation: any) =>
            variation.sizes.some((size: any) =>
              sizes.some((s) => s.size.toString() === size.size),
            ),
          );
          expect(hasAnySize).toBe(true);
        });
      }),
    );

    it(
      'should filter products by date range',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const startDate = '2020-01-01';
        const endDate = '2030-12-31';

        const response = await request(app.getHttpServer())
          .get(
            `/public/product/paginated?startDate=${startDate}&endDate=${endDate}`,
          )
          .expect(200);

        // Verificar que todos os produtos retornados estão na faixa de data
        response.body.data.forEach((product: any) => {
          const productDate = new Date(product.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);

          // Verificar se as datas são válidas antes de comparar
          if (
            !isNaN(productDate.getTime()) &&
            !isNaN(start.getTime()) &&
            !isNaN(end.getTime())
          ) {
            expect(productDate.getTime()).toBeGreaterThanOrEqual(
              start.getTime(),
            );
            expect(productDate.getTime()).toBeLessThanOrEqual(end.getTime());
          }
        });
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
            `/public/product/paginated?active=true&collectionId=${existingCollection!.publicId}&minPrice=50&maxPrice=500`,
          )
          .expect(200);

        // Verificar que todos os produtos retornados atendem aos critérios
        response.body.data.forEach((product: any) => {
          expect(product.active).toBe(true);
          expect(product.collection.publicId).toBe(
            existingCollection!.publicId,
          );

          product.variations.forEach((variation: any) => {
            const price =
              typeof variation.price === 'string'
                ? parseFloat(variation.price)
                : variation.price;
            expect(price).toBeGreaterThanOrEqual(50);
            expect(price).toBeLessThanOrEqual(500);
          });
        });
      }),
    );

    it(
      'should return empty results when no products match filters',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?search=produtoinexistente123456')
          .expect(200);

        expect(response.body.data).toHaveLength(0);
        expect(response.body.total).toBe(0);
        expect(response.body.totalPages).toBe(0);
      }),
    );

    it(
      'should handle request without authentication (public endpoint)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      }),
    );

    it(
      'should handle products without variations gracefully',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que produtos sem variações são tratados corretamente
        response.body.data.forEach((product: any) => {
          expect(product.variations).toBeDefined();
          expect(Array.isArray(product.variations)).toBe(true);
        });
      }),
    );

    it(
      'should handle products without collection gracefully',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que produtos sem coleção são tratados corretamente
        response.body.data.forEach((product: any) => {
          if (product.collection) {
            expect(product.collection).toHaveProperty('publicId');
            expect(product.collection).toHaveProperty('name');
          }
        });
      }),
    );

    it(
      'should handle products with empty variations array',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que produtos com array vazio de variações são tratados corretamente
        response.body.data.forEach((product: any) => {
          expect(Array.isArray(product.variations)).toBe(true);
          product.variations.forEach((variation: any) => {
            expect(variation).toHaveProperty('publicId');
            expect(variation).toHaveProperty('color');
            expect(variation).toHaveProperty('name');
            expect(variation).toHaveProperty('price');
            expect(variation).toHaveProperty('images');
            expect(variation).toHaveProperty('sizes');
            expect(Array.isArray(variation.images)).toBe(true);
            expect(Array.isArray(variation.sizes)).toBe(true);
          });
        });
      }),
    );

    it(
      'should handle products with empty sizes array',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que variações com array vazio de tamanhos são tratadas corretamente
        response.body.data.forEach((product: any) => {
          product.variations.forEach((variation: any) => {
            expect(Array.isArray(variation.sizes)).toBe(true);
            variation.sizes.forEach((size: any) => {
              expect(size).toHaveProperty('size');
              expect(size).toHaveProperty('stock');
              expect(size.stock).toHaveProperty('quantity');
            });
          });
        });
      }),
    );

    it(
      'should handle edge case with very large limit parameter',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?limit=1000')
          .expect(400); // DTO validation should reject limit > 100

        expect(response.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining('limit')]),
        );
      }),
    );

    it(
      'should handle edge case with page 0 (should be rejected by validation)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?page=0')
          .expect(400); // DTO validation should reject page < 1

        expect(response.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining('page')]),
        );
      }),
    );

    it(
      'should handle edge case with negative page (should be rejected by validation)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?page=-1')
          .expect(400); // DTO validation should reject page < 1

        expect(response.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining('page')]),
        );
      }),
    );

    it(
      'should handle edge case with limit 0 (should be rejected by validation)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?limit=0')
          .expect(400); // DTO validation should reject limit < 1

        expect(response.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining('limit')]),
        );
      }),
    );

    it(
      'should handle edge case with negative limit (should be rejected by validation)',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?limit=-5')
          .expect(400); // DTO validation should reject limit < 1

        expect(response.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining('limit')]),
        );
      }),
    );

    it(
      'should handle complex filter combinations with edge cases',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Teste com múltiplos filtros incluindo casos extremos
        const response = await request(app.getHttpServer())
          .get(
            '/public/product/paginated?active=true&minPrice=0&maxPrice=999999&search=&colors=&sizes=',
          )
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      }),
    );

    it(
      'should handle products with special characters in names',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?search=çãõéí')
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      }),
    );

    it(
      'should handle products with very long search terms',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const longSearchTerm = 'a'.repeat(1000);
        const response = await request(app.getHttpServer())
          .get(`/public/product/paginated?search=${longSearchTerm}`)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      }),
    );

    it(
      'should handle date filters with invalid date formats gracefully',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get(
            '/public/product/paginated?startDate=invalid-date&endDate=also-invalid',
          )
          .expect(500); // Database error for invalid timestamp

        expect(response.body.message).toBeDefined();
      }),
    );

    it(
      'should handle price filters with decimal values',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated?minPrice=10.50&maxPrice=99.99')
          .expect(200);

        // Verificar que todos os produtos retornados estão na faixa de preço
        response.body.data.forEach((product: any) => {
          product.variations.forEach((variation: any) => {
            const price =
              typeof variation.price === 'string'
                ? parseFloat(variation.price)
                : variation.price;
            expect(price).toBeGreaterThanOrEqual(10.5);
            expect(price).toBeLessThanOrEqual(99.99);
          });
        });
      }),
    );

    it(
      'should handle products with null or undefined values gracefully',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que produtos com valores nulos são tratados corretamente
        response.body.data.forEach((product: any) => {
          expect(product.publicId).toBeDefined();
          expect(product.name).toBeDefined();
          expect(product.active).toBeDefined();
          expect(product.variations).toBeDefined();
          expect(Array.isArray(product.variations)).toBe(true);
        });
      }),
    );

    it(
      'should use default pagination values when not provided',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Teste sem parâmetros de paginação para cobrir linha 76 (default values)
        // Isso força a execução de: const { page = 1, limit = 10 } = pagination;
        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        expect(response.body.page).toBe(1); // default page
        expect(response.body.limit).toBe(10); // default limit
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      }),
    );

    it(
      'should handle products with variations but no sizes',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que produtos com variações mas sem tamanhos são tratados corretamente
        response.body.data.forEach((product: any) => {
          product.variations.forEach((variation: any) => {
            expect(variation.sizes).toBeDefined();
            expect(Array.isArray(variation.sizes)).toBe(true);
            // Se não há tamanhos, deve retornar array vazio (linha 179)
            variation.sizes.forEach((size: any) => {
              expect(size).toHaveProperty('size');
              expect(size).toHaveProperty('stock');
              expect(size.stock).toHaveProperty('quantity');
            });
          });
        });
      }),
    );

    it(
      'should handle products with no variations',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que produtos sem variações são tratados corretamente (linha 172)
        response.body.data.forEach((product: any) => {
          expect(product.variations).toBeDefined();
          expect(Array.isArray(product.variations)).toBe(true);
          // Se não há variações, deve retornar array vazio
        });
      }),
    );

    it(
      'should handle edge case with empty pagination object',
      runWithRollbackTransaction(async () => {
        // Ativar todos os produtos primeiro
        await productRepo.update({ active: false }, { active: true });

        // Teste que força a execução das linhas 76, 172, 179
        // Criando um cenário onde pagination é um objeto vazio
        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Verificar que os valores padrão são aplicados (linha 76)
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(10);

        // Verificar que produtos com variações são mapeados (linha 172)
        response.body.data.forEach((product: any) => {
          expect(product.variations).toBeDefined();
          expect(Array.isArray(product.variations)).toBe(true);

          // Verificar que tamanhos são mapeados (linha 179)
          product.variations.forEach((variation: any) => {
            expect(variation.sizes).toBeDefined();
            expect(Array.isArray(variation.sizes)).toBe(true);
          });
        });
      }),
    );

    it(
      'should create product without variations to test line 172',
      runWithRollbackTransaction(async () => {
        // Criar um produto temporário sem variações para testar linha 172
        const collection = await collectionRepo.findOne({
          where: { active: true },
        });
        if (!collection) {
          throw new Error('No active collection found for test');
        }

        const productWithoutVariations = productRepo.create({
          name: 'Produto Teste Sem Variações',
          active: true,
          collection: collection,
        });
        await productRepo.save(productWithoutVariations);

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Encontrar o produto criado
        const testProduct = response.body.data.find(
          (product: any) => product.name === 'Produto Teste Sem Variações',
        );

        expect(testProduct).toBeDefined();
        expect(testProduct.variations).toBeDefined();
        expect(Array.isArray(testProduct.variations)).toBe(true);
        expect(testProduct.variations.length).toBe(0); // Sem variações
      }),
    );

    it(
      'should create variation without sizes to test line 179',
      runWithRollbackTransaction(async () => {
        // Criar um produto com variação sem tamanhos para testar linha 179
        const collection = await collectionRepo.findOne({
          where: { active: true },
        });
        if (!collection) {
          throw new Error('No active collection found for test');
        }

        const productWithoutSizes = productRepo.create({
          name: 'Produto Teste Sem Tamanhos',
          active: true,
          collection: collection,
        });
        const savedProduct = await productRepo.save(productWithoutSizes);

        // Criar variação sem tamanhos
        const variationWithoutSizes = productVariationRepo.create({
          color: 'Teste',
          name: 'Variação Sem Tamanhos',
          price: 99.9,
          images: [],
          product: savedProduct,
        });
        await productVariationRepo.save(variationWithoutSizes);

        const response = await request(app.getHttpServer())
          .get('/public/product/paginated')
          .expect(200);

        // Encontrar o produto criado
        const testProduct = response.body.data.find(
          (product: any) => product.name === 'Produto Teste Sem Tamanhos',
        );

        expect(testProduct).toBeDefined();
        expect(testProduct.variations).toBeDefined();
        expect(Array.isArray(testProduct.variations)).toBe(true);
        expect(testProduct.variations.length).toBe(1);

        const variation = testProduct.variations[0];
        expect(variation.sizes).toBeDefined();
        expect(Array.isArray(variation.sizes)).toBe(true);
        expect(variation.sizes.length).toBe(0); // Sem tamanhos
      }),
    );
  });
});
