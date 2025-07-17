import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { Product } from 'src/domain/product/product.entity';

import { AppModule } from 'src/app.module';
import { CreateProductVariationDto } from 'src/domain/product/productVariation/dto/create-product-variation.dto';
import { UpdateProductVariationDto } from 'src/domain/product/productVariation/dto/update-product-variation.dto';
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

  describe('/product-variation/:productPublicId (POST)', () => {
    it(
      'should create a new product variation',
      runWithRollbackTransaction(async () => {
        const product = await productRepo.findOneBy({
          name: 'Calça Jeans Masculina Slim Fit',
        });

        const payload = {
          name: 'Variação Azul',
          color: '#2667ff',
          price: 149.9,
          images: [],
        } as CreateProductVariationDto;

        const response = await request(app.getHttpServer())
          .post(`/product-variation/${product!.publicId}`)
          .send(payload)
          .expect(201);

        expect(response.body.message).toBe('Variação cadastrada com sucesso');
        expect(response.body.data.name).toBe('Variação Azul');

        const variation = await productVariationRepo.findOneBy({
          name: 'Variação Azul',
        });
        expect(variation).toBeDefined();
      }),
    );

    it(
      'should return 404 if product does not exist when creating variation',
      runWithRollbackTransaction(async () => {
        const payload = {
          name: 'Variação Inexistente',
          color: '#000000',
          price: 100,
          images: [],
        } as CreateProductVariationDto;

        const response = await request(app.getHttpServer())
          .post(`/product-variation/00000000-0000-0000-0000-000000000000`)
          .send(payload)
          .expect(404);

        expect(response.body.message).toContain('Produto');
      }),
    );
  });

  describe('/product-variation/:publicId (PATCH)', () => {
    it(
      'should update an existing variation',
      runWithRollbackTransaction(async () => {
        const product = await productRepo.findOne({
          where: { name: 'Calça Jeans Masculina Slim Fit' },
          relations: ['variations'],
        });

        console.log(product);

        const variation = product!.variations[0];

        const updateDto = {
          name: 'Variação Editada',
          price: 199.9,
          color: '#000000',
        } as UpdateProductVariationDto;

        const response = await request(app.getHttpServer())
          .patch(`/product-variation/${variation.publicId}`)
          .send(updateDto)
          .expect(200);

        expect(response.body.message).toBe('Variação atualizada com sucesso');
        expect(response.body.data.name).toBe('Variação Editada');

        const updated = await productVariationRepo.findOneBy({
          id: variation.id,
        });
        expect(updated?.price).toBe('199.90');
      }),
    );

    it(
      'should return 404 if variation does not exist when updating',
      runWithRollbackTransaction(async () => {
        const dto = {
          name: 'Qualquer',
          price: 100,
          color: '#fff',
        } as UpdateProductVariationDto;

        const response = await request(app.getHttpServer())
          .patch(`/product-variation/00000000-0000-0000-0000-000000000000`)
          .send(dto)
          .expect(404);

        expect(response.body.message).toContain('Variação');
      }),
    );
  });

  describe('/product-variation/:publicId (DELETE)', () => {
    it(
      'should delete a variation by publicId',
      runWithRollbackTransaction(async () => {
        const product = await productRepo.findOne({
          where: { name: 'Calça Jeans Masculina Slim Fit' },
          relations: ['variations'],
        });

        const variation = product!.variations[0];

        await request(app.getHttpServer())
          .delete(`/product-variation/${variation.publicId}`)
          .expect(204);

        const deleted = await productVariationRepo.findOneBy({
          publicId: variation.publicId,
        });

        expect(deleted).toBeNull();
      }),
    );

    it(
      'should return 404 if variation does not exist when deleting',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .delete(`/product-variation/00000000-0000-0000-0000-000000000000`)
          .expect(404);

        expect(response.body.message).toContain('Variação');
      }),
    );
  });
});
