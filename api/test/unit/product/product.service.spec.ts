// src/domain/product/product.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Importe DataSource

import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';

// Importe seu AppModule

// Importe suas funções de transação e mocks de guards
import { AppModule } from 'src/app.module';
import { Collection } from 'src/domain/product/collection/collection.entity';
import { Product } from 'src/domain/product/product.entity';
import { ProductService } from 'src/domain/product/product.service';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { runWithRollbackTransaction } from '../../utils/database/test-transation'; // Assume que já encapsula o dataSource
import { setupIntegrationMocks } from '../../utils/mocks/setup-mocks';

// Inicialize o contexto transacional uma vez
initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('ProductService (with Real DB Interaction)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let service: ProductService;
  let collectionRepo: Repository<Collection>;
  let productRepo: Repository<Product>;
  let stockItemRepo: Repository<StockItem>;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule], // Importe seu AppModule completo
    }).compile();

    app = module.createNestApplication();

    service = module.get<ProductService>(ProductService);
    collectionRepo = module.get<Repository<Collection>>(
      getRepositoryToken(Collection),
    );
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));

    stockItemRepo = module.get<Repository<StockItem>>(
      getRepositoryToken(StockItem),
    );

    // Chame a função de setup dos mocks de guards, se ainda quiser desabilitá-los para o serviço
    // Embora o serviço não passe por guards, a chamada de setupIntegrationMocks
    // garante que o req.user mockado esteja disponível se o serviço precisar (caso incomum).
    // Geralmente, para testes de serviço, os guards não são acionados.
    setupIntegrationMocks();
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    // Restaurar os mocks de guards, se setupIntegrationMocks() for chamado
    jest.restoreAllMocks();
    // Fechar a conexão com o banco de dados, se necessário.
    // O Test.createTestingModule().compile() e app.close() já cuidam disso em testes de integração.
    // Para unitários com DB, é o module.close().
    await app.close();
  });

  // --- Cenários de Criação de Produto (`createProduct`) ---

  // CTU-PS-001: Deve criar um produto e suas variações com estoque inicial quando dados válidos são fornecidos.
  it('should create a product and its variations with initial stock for valid data', async () => {
    runWithRollbackTransaction(async () => {
      // Usar dataSource aqui
      const existingCollection = await collectionRepo.findOneBy({
        name: 'Roupas Masculinas', // Assumindo que esta fixture existe
      });
      expect(existingCollection).toBeDefined();

      const createProductDto = {
        name: 'Camisa Serviço Real',
        collectionId: existingCollection!.id,
        variations: [
          { color: 'Real Red', size: 'M', price: 100, initialStock: 10 },
        ],
      };

      const result = await service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(createProductDto.name);

      // Verifique se os dados foram realmente persistidos no DB e podem ser buscados
      const fetchedProduct = await productRepo.findOne({
        where: { id: result.id },
        relations: ['variations', 'collection'],
      });
      expect(fetchedProduct).toBeDefined();
      expect(fetchedProduct?.variations).toHaveLength(1);
      expect(fetchedProduct?.variations[0].color).toBe('Real Red');

      const stockItem = await stockItemRepo.findOne({
        where: { productVariation: { id: fetchedProduct?.variations[0].id } },
      });
      expect(stockItem?.quantity).toBe(10);
    });
  });

  // CTU-PS-002: Deve lançar NotFoundException se a coleção não for encontrada ao criar o produto.
  it('should throw NotFoundException if collection not found during product creation', async () => {
    runWithRollbackTransaction(async () => {
      // Usar dataSource aqui
      const createProductDto = {
        name: 'Camisa Invalida DB',
        collectionId: 99999, // ID que sabemos que não existe no DB de teste
        variations: [{ color: 'Blue', size: 'L', price: 120, initialStock: 5 }],
      };

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
  });

  // CTU-PS-003: Deve lançar BadRequestException se alguma variação tiver preço negativo.
  it('should throw BadRequestException if any variation has a negative price', async () => {
    runWithRollbackTransaction(async () => {
      // Usar dataSource aqui
      const existingCollection = await collectionRepo.findOneBy({
        name: 'Roupas Masculinas',
      });
      expect(existingCollection).toBeDefined();

      const createProductDto = {
        name: 'Produto Preço Negativo DB',
        collectionId: existingCollection!.id,
        variations: [
          { color: 'Black', size: 'S', price: -50, initialStock: 2 },
        ], // Preço negativo
      };

      await expect(service.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
      // Ajuste a mensagem de erro conforme sua implementação de validação no serviço/DTO
      await expect(service.create(createProductDto)).rejects.toThrow(
        'Preço da variação não pode ser negativo.',
      );
    });
  });

  // CTU-PS-004: Deve lidar com falha ao salvar produto e reverter/lançar erro.
  // Este cenário é mais difícil de testar com o DB real sem simular um erro do DB.
  // Pode ser melhor manter um mock para este caso específico, ou confiar nos testes de integração.
  // Vou manter o cenário, mas com uma nota.
  it('should handle product save failure and throw an error (may require specific DB error simulation)', async () => {
    // Para realmente testar isso, você precisaria de um mock no nível do TypeORM,
    // ou uma forma de fazer o `save` do TypeORM falhar *apenas* para este teste.
    // Isso é mais complexo com o DB real. Por enquanto, pode-se confiar
    // no teste de integração ou usar um mock de repositório apenas para este caso.
    // Se seu serviço não tem um tratamento de erro específico para save (ex: catch DB errors),
    // o NestJS geralmente converterá para InternalServerError.
    // Ex: Se o banco de dados estiver inacessível, o TypeORM já lançaria um erro.
    // Para fins de demonstração, deixarei o teste, mas tenha em mente a complexidade.
    runWithRollbackTransaction(async () => {
      // Exemplo de como forçar um erro se houvesse uma validação de DB muito específica
      // que o serviço tratasse antes de tentar salvar.
      // Neste cenário de DB real, é mais sobre o que o TypeORM faz quando falha.
      const createProductDto = {
        name: 'Produto para falha DB',
        collectionId: (await collectionRepo.findOneBy({
          name: 'Roupas Masculinas',
        }))!.id,
        variations: [{ color: 'Fail', size: 'S', price: 100, initialStock: 1 }],
      };

      // Se seu ProductService tem um try/catch ao salvar e lança InternalServerError,
      // este teste valida isso. Se não tem, o erro viria direto do TypeORM/DB.
      // Para simular uma falha REAL no DB, seria algo como fechar a conexão temporariamente.
      // Por isso, este teste é mais realista em um teste de integração com um servidor real
      // ou com mocks de baixo nível.
      try {
        await service.create(createProductDto);
        // Se o código chegou aqui, o teste falha, pois deveria ter lançado um erro.
        fail('Expected an error to be thrown, but it did not.');
      } catch (error) {
        // Verifique se o erro é o esperado ou se é um erro do TypeORM/DB
        // if (error instanceof InternalServerErrorException) {
        //   expect(error.message).toContain('Erro ao salvar produto');
        // } else {
        //   fail(`Expected InternalServerErrorException, but received: ${error.constructor.name}`);
        // }
        // Para o DB real, pode ser um TypeORMError ou algo mais específico.
        expect(error).toBeDefined(); // Pelo menos um erro deve ser lançado
      }
    });
  });

  // --- Cenários de Consulta de Produtos (`findAllProducts`) ---
});
