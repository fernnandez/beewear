import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from 'src/app.module';
import { Collection } from 'src/domain/product/collection/collection.entity';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('PublicCollectionController - Integration (HTTP)', () => {
  let app: INestApplication;
  let collectionRepo: Repository<Collection>;

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
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('GET /public/collection', () => {
    it(
      'should return all active collections for frontend',
      runWithRollbackTransaction(async () => {
        // Verificar se existem coleções ativas no banco
        const activeCollections = await collectionRepo.find({
          where: { active: true },
        });

        expect(activeCollections.length).toBeGreaterThan(0);

        const response = await request(app.getHttpServer())
          .get('/public/collection')
          .expect(200);

        // Verificar estrutura da resposta
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        // Verificar estrutura de cada coleção
        const firstCollection = response.body[0];
        expect(firstCollection).toHaveProperty('publicId');
        expect(firstCollection).toHaveProperty('name');
        expect(firstCollection).toHaveProperty('active');
        expect(firstCollection.active).toBe(true);
        expect(typeof firstCollection.publicId).toBe('string');
        expect(typeof firstCollection.name).toBe('string');
        expect(typeof firstCollection.active).toBe('boolean');

        // Verificar propriedades opcionais
        if (firstCollection.description !== undefined) {
          expect(typeof firstCollection.description).toBe('string');
        }
        if (firstCollection.imageUrl !== undefined) {
          expect(typeof firstCollection.imageUrl).toBe('string');
        }
      }),
    );

    it(
      'should not return inactive collections',
      runWithRollbackTransaction(async () => {
        // Criar uma coleção inativa para teste
        const inactiveCollection = collectionRepo.create({
          name: 'Coleção Inativa Teste',
          active: false,
          description: 'Esta coleção não deve aparecer',
          imageUrl: 'test-inactive.jpg',
        });
        await collectionRepo.save(inactiveCollection);

        const response = await request(app.getHttpServer())
          .get('/public/collection')
          .expect(200);

        // Verificar que a coleção inativa não está na resposta
        const inactiveCollectionInResponse = response.body.find(
          (collection: any) => collection.name === 'Coleção Inativa Teste',
        );
        expect(inactiveCollectionInResponse).toBeUndefined();
      }),
    );

    it(
      'should return empty array when no active collections exist',
      runWithRollbackTransaction(async () => {
        // Desativar todas as coleções existentes
        await collectionRepo.update({ active: true }, { active: false });

        const response = await request(app.getHttpServer())
          .get('/public/collection')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      }),
    );

    it(
      'should return collections with correct data types',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/public/collection')
          .expect(200);

        response.body.forEach((collection: any) => {
          // Verificar tipos de dados obrigatórios
          expect(typeof collection.publicId).toBe('string');
          expect(collection.publicId.length).toBeGreaterThan(0);
          expect(typeof collection.name).toBe('string');
          expect(collection.name.length).toBeGreaterThan(0);
          expect(typeof collection.active).toBe('boolean');
          expect(collection.active).toBe(true);

          // Verificar tipos de dados opcionais
          if (
            collection.description !== undefined &&
            collection.description !== null
          ) {
            expect(typeof collection.description).toBe('string');
          }
          if (
            collection.imageUrl !== undefined &&
            collection.imageUrl !== null
          ) {
            expect(typeof collection.imageUrl).toBe('string');
          }
        });
      }),
    );

    it(
      'should handle request without authentication (public endpoint)',
      runWithRollbackTransaction(async () => {
        // Este teste verifica se o endpoint é realmente público
        // Não deve requerer autenticação
        const response = await request(app.getHttpServer())
          .get('/public/collection')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
      }),
    );
  });
});
