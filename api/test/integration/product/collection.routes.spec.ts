// src/domain/product/collection/collection.controller.spec.ts

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('CollectionController - Integration (HTTP)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    // Pipe global de validação (se você usa)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    setupIntegrationMocks(); // mocks de auth, se necessário
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  it(
    'POST /collection - should create collection with valid data',
    runWithRollbackTransaction(async () => {
      const dto = { name: 'Linha Esportiva', active: true };

      const response = await request(app.getHttpServer())
        .post('/collection')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(dto.name);
      expect(response.body).toHaveProperty('publicId');
    }),
  );

  it('GET /collection - should return list of collection', async () => {
    const response = await request(app.getHttpServer())
      .get('/collection')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /collection/:publicId - should return collection details by publicId', async () => {
    // Primeiro pega uma coleção existente (ex: via GET /collection)
    const listResponse = await request(app.getHttpServer()).get('/collection');
    const firstCollection = listResponse.body[0];

    const response = await request(app.getHttpServer())
      .get(`/collection/${firstCollection.publicId}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.publicId).toBe(firstCollection.publicId);
    expect(response.body.name).toBe(firstCollection.name);
    expect(response.body.aggregations).toEqual(
      expect.objectContaining({
        totalProducts: expect.any(Number),
        totalStock: expect.any(Number),
        totalValue: expect.any(Number),
      }),
    );
    expect(response.body.products).toBeDefined();
  });

  it('GET /collection/:publicId - should return 404 Not Found if collection not found', async () => {
    const notFoundPublicId = 'b00cd611-df8d-4be1-85b1-171c042a69d2';

    await request(app.getHttpServer())
      .get(`/collection/${notFoundPublicId}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Coleção não encontrada',
        error: 'Not Found',
      });
  });
});
