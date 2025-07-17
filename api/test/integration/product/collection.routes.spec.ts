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

  describe('POST /collection', () => {
    it(
      'should create collection with valid data',
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
  });

  describe('PATCH /collection/:publicId/status', () => {
    it(
      'should update collection statue (active or inactive)',
      runWithRollbackTransaction(async () => {
        const existentCollectionPublicId =
          '339df8dd-d947-4849-8334-105aab258ee5';
        const dto = { isActive: false };

        const response = await request(app.getHttpServer())
          .patch(`/collection/${existentCollectionPublicId}/status`)
          .send(dto)
          .expect(200);

        expect(response.body.message).toBe(
          'Status da coleção atualizado com sucesso',
        );
        expect(response.body.data.active).toBeFalsy();
      }),
    );

    it(
      'should return 404 Not Found if collection not found',
      runWithRollbackTransaction(async () => {
        const notFoundPublicId = 'b00cd611-df8d-4be1-85b1-171c042a69d2';

        const dto = { isActive: false };

        await request(app.getHttpServer())
          .patch(`/collection/${notFoundPublicId}/status`)
          .send(dto)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Coleção não encontrada',
            error: 'Not Found',
          });
      }),
    );
  });

  describe('PATCH /collection/:publicId/', () => {
    it(
      'should update collection statue (active or inactive)',
      runWithRollbackTransaction(async () => {
        const existentCollectionPublicId =
          '339df8dd-d947-4849-8334-105aab258ee5';
        const dto = { name: 'test name', description: 'description test' };

        const response = await request(app.getHttpServer())
          .patch(`/collection/${existentCollectionPublicId}`)
          .send(dto)
          .expect(200);

        expect(response.body.message).toBe('Coleção atualizada com sucesso');
        expect(response.body.data.name).toBe(dto.name);
        expect(response.body.data.description).toBe(dto.description);
      }),
    );

    it(
      'should return 404 Not Found if collection not found',
      runWithRollbackTransaction(async () => {
        const notFoundPublicId = 'b00cd611-df8d-4be1-85b1-171c042a69d2';

        const dto = { name: 'test name', description: 'description test' };

        await request(app.getHttpServer())
          .patch(`/collection/${notFoundPublicId}`)
          .send(dto)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Coleção não encontrada',
            error: 'Not Found',
          });
      }),
    );
  });

  describe('GET /collection', () => {
    it('should return list of collection', async () => {
      const response = await request(app.getHttpServer())
        .get('/collection')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /collection/:publicId', () => {
    it('should return collection details by publicId', async () => {
      const listResponse = await request(app.getHttpServer()).get(
        '/collection',
      );
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
    });

    it('should return 404 Not Found if collection not found', async () => {
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

  describe('PATCH /collection/:publicId/image', () => {
    it('should update collection image by publicId', async () => {
      const listResponse = await request(app.getHttpServer()).get(
        '/collection',
      );
      const firstCollection = listResponse.body[0];

      const response = await request(app.getHttpServer())
        .patch(`/collection/${firstCollection.publicId}/image`)
        .send({ image: 'test-image' })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Imagem atualizada com sucesso');
    });

    it('should return 404 Not Found if collection not found', async () => {
      const notFoundPublicId = 'b00cd611-df8d-4be1-85b1-171c042a69d2';

      await request(app.getHttpServer())
        .patch(`/collection/${notFoundPublicId}/image`)
        .send({ image: 'test-image' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Coleção não encontrada',
          error: 'Not Found',
        });
    });
  });

  describe('DELETE /collection/:publicId', () => {
    it('should delete collection by publicId', async () => {
      const listResponse = await request(app.getHttpServer()).get(
        '/collection',
      );
      const firstCollection = listResponse.body[0];

      const response = await request(app.getHttpServer())
        .delete(`/collection/${firstCollection.publicId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Coleção excluida com sucesso');
    });

    it('should return 404 Not Found if collection not found', async () => {
      const notFoundPublicId = 'b00cd611-df8d-4be1-85b1-171c042a69d2';

      await request(app.getHttpServer())
        .delete(`/collection/${notFoundPublicId}`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Coleção não encontrada',
          error: 'Not Found',
        });
    });
  });
});
