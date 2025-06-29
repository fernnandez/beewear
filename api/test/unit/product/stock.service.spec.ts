import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

import { AppModule } from 'src/app.module';
import { ProductVariation } from 'src/domain/product/productVariation/product-variation.entity';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import { StockMovement } from 'src/domain/product/stock/stock-movement.entity';
import { StockService } from 'src/domain/product/stock/stock.service';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  ProductVariationSize,
  Size,
} from 'src/domain/product/productVariation/product-variation-size.entity';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('StockService (with Real DB Interaction)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let service: StockService;
  let variationRepo;
  let variationSizeRepo;
  let stockRepo;
  let movementRepo;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<StockService>(StockService);
    variationRepo = module.get(getRepositoryToken(ProductVariation));
    variationSizeRepo = module.get(getRepositoryToken(ProductVariationSize));
    stockRepo = module.get(getRepositoryToken(StockItem));
    movementRepo = module.get(getRepositoryToken(StockMovement));

    setupIntegrationMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it('should create initial stock for a variation without stock', async () => {
    return runWithRollbackTransaction(async () => {
      const variation = await variationRepo.save({
        publicId: '1c8be5d7-113f-5323-aa9d-2827a7b177fd',
        color: 'Verde Limão',
        price: 89.9,
        product: { id: 101 },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const variationSize = await variationSizeRepo.save({
        productVariation: variation,
        size: Size.M,
      });

      const stock = await service.createInitialStock(variation, 25);

      expect(stock).toBeDefined();
      expect(stock.productVariationSize.id).toBe(variationSize.id);
      expect(stock.quantity).toBe(25);

      const found = await stockRepo.findOne({
        where: { id: stock.id },
        relations: ['productVariationSize'],
      });
      expect(found).not.toBeNull();
      expect(found?.productVariation.id).toBe(variation.id);

      const movements = await movementRepo.find({
        where: { stockItem: { id: stock.id } },
      });
      expect(movements).toHaveLength(1);
      expect(movements[0].type).toBe('IN');
      expect(movements[0].quantity).toBe(25);
    });
  });

  it('should throw error if stock already exists for variation', async () => {
    const [existing] = await variationSizeRepo.find(); // corrigido com await

    await expect(service.createInitialStock(existing, 10)).rejects.toThrow(
      'Estoque já registrado para este produto',
    );
  });
});
