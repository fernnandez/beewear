import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from 'src/app.module';
import { Collection } from 'src/domain/product/collection/collection.entity';
import { CollectionService } from 'src/domain/product/collection/collection.service';
import { CreateCollectionDto } from 'src/domain/product/collection/create-collection.dto';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('CollectionService (with Real DB Interaction)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let service: CollectionService;
  let repo: Repository<Collection>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<CollectionService>(CollectionService);
    repo = module.get(getRepositoryToken(Collection));

    setupIntegrationMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it(
    'should create a collection with valid data',
    runWithRollbackTransaction(async () => {
      const dto = { name: 'Linha Premium Masculina' } as CreateCollectionDto;
      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(result.name).toBe(dto.name);
      expect(result.publicId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );

      const found = await repo.findOneBy({ id: result.id });
      expect(found).not.toBeNull();
    }),
  );

  it('should return all collections', async () => {
    const collections = await service.findAll();
    expect(Array.isArray(collections)).toBe(true);
    expect(collections.length).toBeGreaterThan(0);
  });

  it('should find a collection by publicId', async () => {
    const [existing] = await repo.find();
    expect(existing).toBeDefined();

    const found = await service.findOne(existing.publicId);
    expect(found).toBeDefined();
    expect(found.id).toBe(existing.id);
  });

  it('should throw if collection not found by publicId', async () => {
    await expect(
      service.findOne('f9999999-aaaa-bbbb-cccc-deadbeef0000'),
    ).rejects.toThrow('Coleção não encontrada');
  });
});
