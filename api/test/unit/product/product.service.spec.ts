import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { INestApplication, NotFoundException } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Collection } from 'src/domain/product/collection/collection.entity';
import { CreateProductDto } from 'src/domain/product/dto/create-product.dto';
import { Product } from 'src/domain/product/product.entity';
import { ProductService } from 'src/domain/product/product.service';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { Size } from 'src/domain/product/productVariation/product-variation-size.entity';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('ProductService (with Real DB Interaction)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let service: ProductService;
  let collectionRepo: Repository<Collection>;
  let productRepo: Repository<Product>;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    service = module.get<ProductService>(ProductService);
    collectionRepo = module.get<Repository<Collection>>(
      getRepositoryToken(Collection),
    );
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));

    setupIntegrationMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it(
    'should create a product and its variations with initial stock for valid data',
    runWithRollbackTransaction(async () => {
      const existingCollection = await collectionRepo.findOneBy({
        name: 'Roupas Masculinas',
      });
      expect(existingCollection).toBeDefined();

      const createProductDto = {
        name: 'Camisa Serviço Real',
        active: true,
        collectionPublicId: existingCollection!.publicId,
        variations: [
          {
            color: 'Real Red',
            name: 'Camisa Real',
            price: 100,
          },
        ],
      } as CreateProductDto;

      const result = await service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(createProductDto.name);

      // Buscar produto com variações e sizes
      const fetchedProduct = await productRepo.findOne({
        where: { id: result.id },
        relations: [
          'variations',
          'variations.sizes',
          'variations.sizes.stock',
          'collection',
        ],
      });

      expect(fetchedProduct).toBeDefined();
      expect(fetchedProduct?.variations).toHaveLength(1);

      const variation = fetchedProduct!.variations[0];
      expect(variation.color).toBe('Real Red');
      expect(variation.name).toBe('Camisa Real');
      expect(variation.price).toBe('100.00');

      const variationSizes = variation.sizes;
      expect(variationSizes).toHaveLength(Object.values(Size).length);

      const variationSize = variationSizes[0];
      expect(variationSize.stock).toBeDefined();
      expect(variationSize.stock.quantity).toBe(0);
    }),
  );

  it('should throw NotFoundException if collection not found during product creation', async () => {
    // Usar dataSource aqui

    const createProductDto = {
      name: 'Camisa Serviço Real',
      active: true,
      collectionPublicId: '1fca6fb9-3cdf-553c-93ce-7663ff4e831a', // PublicId que sabemos que não existe no DB de teste
      variations: [
        {
          color: 'Real Red',
          name: 'Camisa Real',
          price: 100,
        },
      ],
    } as CreateProductDto;

    await expect(service.create(createProductDto)).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.create(createProductDto)).rejects.toThrow(
      'Coleção não encontrada',
    );
    // Verifique que nada foi salvo no DB
    const productsAfter = await productRepo.find();
    expect(productsAfter).toHaveLength(3); // Assumindo 3 produtos iniciais de fixtures
  });

  // CTU-PS-004: Deve lidar com falha ao salvar produto e reverter/lançar erro.
  // Este cenário é mais difícil de testar com o DB real sem simular um erro do DB.
  // Pode ser melhor manter um mock para este caso específico, ou confiar nos testes de integração.
  // Vou manter o cenário, mas com uma nota.
  // it(
  //   'should handle product save failure and throw an error (may require specific DB error simulation)',
  //   // Para realmente testar isso, você precisaria de um mock no nível do TypeORM,
  //   // ou uma forma de fazer o `save` do TypeORM falhar *apenas* para este teste.
  //   // Isso é mais complexo com o DB real. Por enquanto, pode-se confiar
  //   // no teste de integração ou usar um mock de repositório apenas para este caso.
  //   // Se seu serviço não tem um tratamento de erro específico para save (ex: catch DB errors),
  //   // o NestJS geralmente converterá para InternalServerError.
  //   // Ex: Se o banco de dados estiver inacessível, o TypeORM já lançaria um erro.
  //   // Para fins de demonstração, deixarei o teste, mas tenha em mente a complexidade.
  //   runWithRollbackTransaction(async () => {
  //     // Exemplo de como forçar um erro se houvesse uma validação de DB muito específica
  //     // que o serviço tratasse antes de tentar salvar.
  //     // Neste cenário de DB real, é mais sobre o que o TypeORM faz quando falha.
  //     const createProductDto = {
  //       name: 'Produto para falha DB',
  //       active: true,
  //       collectionPublicId: (await collectionRepo.findOneBy({
  //         name: 'Roupas Masculinas',
  //       }))!.publicId,
  //       variations: [{ color: 'Fail', size: 'S', price: 100, initialStock: 1 }],
  //     };

  //     try {
  //       await service.create(createProductDto);
  //       // Se o código chegou aqui, o teste falha, pois deveria ter lançado um erro.
  //       fail('Expected an error to be thrown, but it did not.');
  //     } catch (error) {
  //       // Verifique se o erro é o esperado ou se é um erro do TypeORM/DB
  //       // if (error instanceof InternalServerErrorException) {
  //       //   expect(error.message).toContain('Erro ao salvar produto');
  //       // } else {
  //       //   fail(`Expected InternalServerErrorException, but received: ${error.constructor.name}`);
  //       // }
  //       // Para o DB real, pode ser um TypeORMError ou algo mais específico.
  //       expect(error).toBeDefined(); // Pelo menos um erro deve ser lançado
  //     }
  //   }),
  // );

  // --- Cenários de Consulta de Produtos (`findAllProducts`) ---
});
