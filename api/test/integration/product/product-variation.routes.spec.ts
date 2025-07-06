import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { Product } from 'src/domain/product/product.entity';

import { AppModule } from 'src/app.module';
import { ProductVariation } from 'src/domain/product/productVariation/product-variation.entity';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('ProductVariationController (Integration - Routes) with Fixtures', () => {
  let app: INestApplication;
  let productRepo: Repository<Product>;
  let productVariationRepo: Repository<ProductVariation>;

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    setupIntegrationMocks();

    await app.init();

    productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
    productVariationRepo = app.get<Repository<ProductVariation>>(
      getRepositoryToken(ProductVariation),
    );
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('/product-variation/:publicId/images (PATCH)', () => {
    it(
      'should add images to a product variation',
      runWithRollbackTransaction(async () => {
        const product = await productRepo.findOne({
          where: { name: 'Calça Jeans Masculina Slim Fit' },
          relations: ['variations'],
        });

        const variation = product!.variations[0];

        const images = ['img1.png', 'img2.jpg'];

        const response = await request(app.getHttpServer())
          .patch(`/product-variation/${variation.publicId}/images`)
          .send({ images })
          .expect(200);

        expect(response.body.message).toBe('Imagens adicionadas com sucesso');

        const updatedVariation = await productVariationRepo.findOneBy({
          id: variation.id,
        });

        expect(updatedVariation?.images).toEqual(
          expect.arrayContaining(images),
        );
      }),
    );

    it(
      'should return 404 if variation is not found when adding images',
      runWithRollbackTransaction(async () => {
        await request(app.getHttpServer())
          .patch(
            `/product-variation/00000000-0000-0000-0000-000000000000/images`,
          )
          .send({ images: ['any.jpg'] })
          .expect(404)
          .expect({
            statusCode: 404,
            message:
              'Variação 00000000-0000-0000-0000-000000000000 não encontrada',
            error: 'Not Found',
          });
      }),
    );
  });

  describe('/product-variation/:publicId/images/remove (PATCH)', () => {
    it(
      'should remove an image from a product variation',
      runWithRollbackTransaction(async () => {
        const product = await productRepo.findOne({
          where: { name: 'Calça Jeans Masculina Slim Fit' },
          relations: ['variations'],
        });

        const variation = product!.variations[0];

        await productVariationRepo.save({
          ...variation,
          images: ['to-remove.jpg', 'keep.jpg'],
        });

        const response = await request(app.getHttpServer())
          .patch(`/product-variation/${variation.publicId}/images/remove`)
          .send({ image: 'to-remove.jpg' })
          .expect(200);

        expect(response.body.message).toBe('Imagem removida com sucesso');

        const updatedVariation = await productVariationRepo.findOneBy({
          id: variation.id,
        });

        expect(updatedVariation?.images).not.toContain('to-remove.jpg');
        expect(updatedVariation?.images).toContain('keep.jpg');
      }),
    );

    it(
      'should return 404 if variation is not found when removing image',
      runWithRollbackTransaction(async () => {
        await request(app.getHttpServer())
          .patch(
            `/product-variation/00000000-0000-0000-0000-000000000000/images/remove`,
          )
          .send({ image: 'x.jpg' })
          .expect(404)
          .expect({
            statusCode: 404,
            message:
              'Variação 00000000-0000-0000-0000-000000000000 não encontrada',
            error: 'Not Found',
          });
      }),
    );

    it(
      'should return 404 if image does not exist in variation',
      runWithRollbackTransaction(async () => {
        const product = await productRepo.findOne({
          where: { name: 'Calça Jeans Masculina Slim Fit' },
          relations: ['variations'],
        });

        const variation = product!.variations[0];

        await productVariationRepo.save({
          ...variation,
          images: ['only-this.jpg'],
        });

        const response = await request(app.getHttpServer())
          .patch(`/product-variation/${variation.publicId}/images/remove`)
          .send({ image: 'nonexistent.jpg' })
          .expect(404);

        expect(response.body.message).toBe(
          'Imagem "nonexistent.jpg" não encontrada nessa variação',
        );
      }),
    );
  });
});
