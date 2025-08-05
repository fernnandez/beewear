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
});
