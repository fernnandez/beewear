import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

// Importações do seu projeto (ajuste os caminhos de import para 'src/domain/...')
import { Collection } from 'src/domain/product/collection/collection.entity';
import { Product } from 'src/domain/product/product.entity';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import { StockMovement } from 'src/domain/product/stock/stock-movement.entity'; // Adicionado

// Importar a função de setup dos mocks
import { AppModule } from 'src/app.module';
import { ProductVariation } from 'src/domain/product/productVariation/product-variation.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { createTestingApp } from '../../utils/create-testing-app';
import { runWithRollbackTransaction } from '../../utils/database/test-transation'; // Assume que já encapsula o dataSource
import { setupIntegrationMocks } from '../../utils/mocks/setup-mocks';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('ProductController (Integration - Routes) with Fixtures', () => {
  let app: INestApplication;
  let collectionRepo: Repository<Collection>;
  let productRepo: Repository<Product>;
  let productVariationRepo: Repository<ProductVariation>; // Adicionado
  let stockItemRepo: Repository<StockItem>;
  let stockMovementRepo: Repository<StockMovement>; // Adicionado

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    // Chame a função de setup dos mocks
    setupIntegrationMocks();

    await app.init();

    collectionRepo = app.get<Repository<Collection>>(
      getRepositoryToken(Collection),
    );
    productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
    productVariationRepo = app.get<Repository<ProductVariation>>(
      getRepositoryToken(ProductVariation),
    ); // Obtenha o repositório de variação
    stockItemRepo = app.get<Repository<StockItem>>(
      getRepositoryToken(StockItem),
    );
    stockMovementRepo = app.get<Repository<StockMovement>>(
      getRepositoryToken(StockMovement),
    ); // Obtenha o repositório de movimento de estoque
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  // ---

  describe('/product (POST)', () => {
    it(
      'should create a product with variations and initial stock (using fixture collection)',
      runWithRollbackTransaction(async () => {
        // Usando async para a callback
        const existingCollection = await collectionRepo.findOneBy({
          name: 'Roupas Masculinas', // Assumindo que esta fixture existe
        });
        expect(existingCollection).toBeDefined();

        const createProductDto = {
          name: 'Produto Teste CTI-PC-001',
          collectionPublicId: existingCollection!.publicId,
          variations: [
            { color: 'Azul', size: 'M', price: 150.0, initialStock: 50 },
            { color: 'Verde', size: 'G', price: 160.0, initialStock: 30 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(201);

        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(createProductDto.name);
        expect(response.body.collection.publicId).toBe(
          createProductDto.collectionPublicId,
        );

        // Verifique o produto e variações persistidos
        const createdProduct = await productRepo.findOne({
          where: { id: response.body.id },
          relations: ['variations'],
        });
        expect(createdProduct).toBeDefined();
        expect(createdProduct?.variations).toHaveLength(2); // Duas variações criadas

        // Verifique os itens de estoque para cada variação
        for (const variationData of createProductDto.variations) {
          const newVariation = createdProduct?.variations.find(
            (v) =>
              v.color === variationData.color && v.size === variationData.size,
          );
          expect(newVariation).toBeDefined();

          const newStockItem = await stockItemRepo.findOne({
            where: { productVariation: { id: newVariation?.id } },
          });
          expect(newStockItem).toBeDefined();
          expect(newStockItem?.quantity).toBe(variationData.initialStock);

          // Verifique se houve um movimento de estoque inicial
          const stockMovement = await stockMovementRepo.findOne({
            where: { stockItem: { id: newStockItem?.id } },
          });
          expect(stockMovement).toBeDefined();
          expect(stockMovement?.quantity).toBe(variationData.initialStock);
          expect(stockMovement?.type).toBe('IN'); // Assumindo um tipo 'initial'
        }
      }),
    );

    it(
      'should return 404 Not Found if collection not found',
      runWithRollbackTransaction(async () => {
        const createProductDto = {
          name: 'Produto Teste CTI-PC-002',
          collectionPublicId: '61e0a4db-58f8-5ef2-b7f5-119384085949', // Um ID que não existe
          variations: [
            { color: 'Red', size: 'XL', price: 200.0, initialStock: 5 },
          ],
        };

        await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Coleção não encontrada',
            error: 'Not Found',
          });

        // Verifique que nenhum produto EXTRA foi criado
        const productsAfterTest = await productRepo.find();
        // Assumindo que suas fixtures carregam 3 produtos e são revertidas
        // para esse estado para cada transação.
        expect(productsAfterTest).toHaveLength(3);
      }),
    );

    it(
      'should return 400 Bad Request if creation DTO is invalid (e.g., empty name)',
      runWithRollbackTransaction(async () => {
        const createProductDto = {
          name: '', // Nome vazio
          collectionPublicId: (await collectionRepo.findOneBy({
            name: 'Roupas Masculinas',
          }))!.publicId,
          variations: [
            { color: 'Branco', size: 'P', price: 50.0, initialStock: 10 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array); // NestJS validation pipe retorna array de erros
        expect(response.body.message[0]).toContain('name should not be empty'); // Ajuste a mensagem de erro conforme seu DTO de validação
      }),
    );

    it(
      'should return 400 Bad Request if variations are invalid (e.g., negative price)',
      runWithRollbackTransaction(async () => {
        const createProductDto = {
          name: 'Produto Com Variação Inválida',
          collectionPublicId: (await collectionRepo.findOneBy({
            name: 'Roupas Masculinas',
          }))!.publicId,
          variations: [
            { color: 'Preto', size: 'M', price: -10.0, initialStock: 20 }, // Preço negativo
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/product')
          .send(createProductDto)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array);
        expect(response.body.message[0]).toContain(
          'price must not be less than 0',
        ); // Ajuste conforme sua validação
      }),
    );
  });

  // ---

  describe.skip('/product (GET)', () => {
    // CTI-PC-005: Deve retornar todos os produtos existentes com sucesso.
    it(
      'should return all existing products successfully',
      runWithRollbackTransaction(async () => {
        const response = await request(app.getHttpServer())
          .get('/product')
          .expect(200);

        console.log(response);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(3); // Assumindo 3 produtos nas fixtures
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].variations).toBeInstanceOf(Array); // Verifique que variações são carregadas
      }),
    );

    // CTI-PC-006: Deve retornar um array vazio se não houver produtos.
    // Para este teste, vamos garantir que o banco esteja vazio antes.
    it(
      'should return an empty array if no products exist',
      runWithRollbackTransaction(async () => {
        // Limpar todos os produtos (e suas dependências como variações, estoque)
        // antes de testar o cenário de "sem produtos".
        // A ordem de exclusão é importante devido às chaves estrangeiras.
        await stockMovementRepo.delete({});
        await stockItemRepo.delete({});
        await productVariationRepo.delete({});
        await productRepo.delete({});
        await collectionRepo.delete({}); // Ou recarregar apenas as coleções vazias se necessário.

        // Opcional: Recarregar apenas fixtures de coleção se elas forem um pré-requisito para o sistema funcionar,
        // mas não para o retorno de produtos específicos.
        // Se suas fixtures já garantem isso, este bloco de exclusão pode ser ajustado.

        const response = await request(app.getHttpServer())
          .get('/product')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(0);
      }),
    );
  });
});
