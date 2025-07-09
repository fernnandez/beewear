import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import { StockMovement } from 'src/domain/product/stock/stock-movement.entity';
import * as request from 'supertest';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import { Repository } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

describe('StockController (Integration - Routes) with Fixtures', () => {
  let app: INestApplication;
  let stockItemRepo: Repository<StockItem>;
  let movementRepo: Repository<StockMovement>;

  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    setupIntegrationMocks();

    await app.init();

    stockItemRepo = app.get<Repository<StockItem>>(
      getRepositoryToken(StockItem),
    );
    movementRepo = app.get<Repository<StockMovement>>(
      getRepositoryToken(StockMovement),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /stock/:stockItemPublicId/adjust', () => {
    it(
      'should correctly adjust stock (IN)',
      runWithRollbackTransaction(async () => {
        const stockItem = await stockItemRepo.findOne({
          where: { publicId: '241d8486-ef4b-5a20-a011-96093bf53863' },
        });
        const previousQuantity = stockItem!.quantity;
        const adjustment = 5;
        const newQuantity = previousQuantity + adjustment;

        const res = await request(app.getHttpServer())
          .post(`/stock/${stockItem!.publicId}/adjust`)
          .send({
            quantity: adjustment,
            description: 'Reposição de estoque',
          })
          .expect(200);

        expect(res.body.data.quantity).toEqual(newQuantity);

        const movement = await movementRepo.findOne({
          where: { stockItem: { id: stockItem!.id }, type: 'IN' },
          order: { createdAt: 'DESC' },
        });

        expect(movement?.description).toEqual('Reposição de estoque');
        expect(movement?.quantity).toEqual(adjustment);
        expect(movement?.previousQuantity).toEqual(previousQuantity);
        expect(movement?.newQuantity).toEqual(newQuantity);
      }),
    );

    it(
      'should correctly adjust stock (OUT)',
      runWithRollbackTransaction(async () => {
        const stockItem = await stockItemRepo.findOne({
          where: { publicId: '241d8486-ef4b-5a20-a011-96093bf53863' },
        });
        const previousQuantity = stockItem!.quantity;
        const adjustment = -4;
        const newQuantity = previousQuantity + adjustment;

        const res = await request(app.getHttpServer())
          .post(`/stock/${stockItem!.publicId}/adjust`)
          .send({
            quantity: adjustment,
            description: 'Venda presencial',
          })
          .expect(200);

        expect(res.body.data.quantity).toEqual(newQuantity);

        const movement = await movementRepo.findOne({
          where: { stockItem: { id: stockItem!.id }, type: 'OUT' },
          order: { createdAt: 'DESC' },
        });

        expect(movement?.description).toEqual('Venda presencial');
        expect(movement?.quantity).toEqual(Math.abs(adjustment));
        expect(movement?.previousQuantity).toEqual(previousQuantity);
        expect(movement?.newQuantity).toEqual(newQuantity);
      }),
    );

    it(
      'should fallback to default description on OUT',
      runWithRollbackTransaction(async () => {
        const stockItem = await stockItemRepo.findOne({
          where: { publicId: '241d8486-ef4b-5a20-a011-96093bf53863' },
        });
        const previousQuantity = stockItem!.quantity;
        const adjustment = -2;
        const newQuantity = previousQuantity + adjustment;

        await request(app.getHttpServer())
          .post(`/stock/${stockItem!.publicId}/adjust`)
          .send({
            quantity: adjustment,
          })
          .expect(200);

        const movement = await movementRepo.findOne({
          where: { stockItem: { id: stockItem!.id }, type: 'OUT' },
          order: { createdAt: 'DESC' },
        });

        expect(movement?.description).toEqual('Saída de estoque');
        expect(movement?.previousQuantity).toEqual(previousQuantity);
        expect(movement?.newQuantity).toEqual(newQuantity);
      }),
    );

    it(
      'should fallback to default description on IN',
      runWithRollbackTransaction(async () => {
        const stockItem = await stockItemRepo.findOne({
          where: { publicId: '241d8486-ef4b-5a20-a011-96093bf53863' },
        });
        const previousQuantity = stockItem!.quantity;
        const adjustment = 3; // positivo => IN
        const newQuantity = previousQuantity + adjustment;

        await request(app.getHttpServer())
          .post(`/stock/${stockItem!.publicId}/adjust`)
          .send({
            quantity: adjustment,
            // sem description
          })
          .expect(200);

        const movement = await movementRepo.findOne({
          where: { stockItem: { id: stockItem!.id }, type: 'IN' },
          order: { createdAt: 'DESC' },
        });

        expect(movement?.description).toEqual('Entrada de estoque');
        expect(movement?.previousQuantity).toEqual(previousQuantity);
        expect(movement?.newQuantity).toEqual(newQuantity);
      }),
    );

    it(
      'should throw error if stock is insufficient for OUT adjustment',
      runWithRollbackTransaction(async () => {
        const stockItem = await stockItemRepo.findOne({
          where: { publicId: '241d8486-ef4b-5a20-a011-96093bf53863' },
        });
        const previousQuantity = stockItem!.quantity;
        const adjustment = -(previousQuantity + 10); // saída maior que estoque atual

        const res = await request(app.getHttpServer())
          .post(`/stock/${stockItem!.publicId}/adjust`)
          .send({
            quantity: adjustment,
            description: 'Tentativa de saída maior que estoque',
          })
          .expect(400);

        expect(res.body.message).toContain(
          'Estoque insuficiente para realizar esta saída',
        );
      }),
    );

    it('should return 404 if stock item does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post(`/stock/00000000-0000-0000-0000-000000000000/adjust`)
        .send({
          quantity: 0,
          description: 'Reposição de estoque',
        })
        .expect(404);

      expect(res.body.message).toEqual('Estoque não encontrado');
    });
  });

  describe('GET /stock/:stockItemPublicId/movements', () => {
    it(
      'should return stock movements list for existing stock item',
      runWithRollbackTransaction(async () => {
        const stockItem = await stockItemRepo.findOne({
          where: { publicId: '241d8486-ef4b-5a20-a011-96093bf53863' },
        });
        const res = await request(app.getHttpServer())
          .get(`/stock/${stockItem!.publicId}/movements`)
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        // checar propriedades do primeiro item retornado
        const movement = res.body[0];
        expect(movement).toHaveProperty('publicId');
        expect(movement).toHaveProperty('type');
        expect(movement).toHaveProperty('quantity');
        expect(movement).toHaveProperty('description');
        expect(movement).toHaveProperty('createdAt');
      }),
    );

    it(
      'should return empty array if no movements exist for stock item',
      runWithRollbackTransaction(async () => {
        // Criar stock item sem movimentações
        const newStockItem = await stockItemRepo.save({
          productVariationSize: { id: 9999 }, // ajuste conforme necessário
          quantity: 0,
        });

        const res = await request(app.getHttpServer())
          .get(`/stock/${newStockItem.publicId}/movements`)
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
      }),
    );
  });
});
