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

  it(
    'should test findAllPaginated with undefined pagination values (line 76)',
    runWithRollbackTransaction(async () => {
      // Mock data
      const mockProducts = [
        {
          id: 1,
          publicId: 'test-1',
          name: 'Product 1',
          active: true,
          collection: {
            publicId: 'collection-1',
            name: 'Collection 1',
            active: true,
            description: 'Test collection',
            imageUrl: 'test.jpg',
          },
          variations: [
            {
              publicId: 'variation-1',
              color: 'Red',
              name: 'Red Variation',
              price: '99.90',
              images: ['image1.jpg'],
              sizes: [
                {
                  size: 42,
                  stock: {
                    quantity: 10,
                  },
                },
              ],
            },
          ],
        },
      ];

      // Mock repository methods
      jest.spyOn(productRepo, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockProducts, 1]),
      } as any);

      // Test with undefined pagination values to cover line 76
      const result = await service.findAllPaginated({}, {});

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1); // default value
      expect(result.limit).toBe(10); // default value
    }),
  );

  it(
    'should test mapToProductListResponseDto with product without variations (line 172)',
    runWithRollbackTransaction(async () => {
      // Create a product without variations
      const productWithoutVariations = {
        id: 1,
        publicId: 'test-1',
        name: 'Product Without Variations',
        active: true,
        collection: {
          publicId: 'collection-1',
          name: 'Collection 1',
          active: true,
          description: 'Test collection',
          imageUrl: 'test.jpg',
        },
        variations: null, // No variations to test line 172
      };

      // Use reflection to access private method
      const mapToProductListResponseDto = (
        service as any
      ).mapToProductListResponseDto.bind(service);
      const result = mapToProductListResponseDto(productWithoutVariations);

      expect(result).toBeDefined();
      expect(result.publicId).toBe('test-1');
      expect(result.name).toBe('Product Without Variations');
      expect(result.variations).toEqual([]); // Should be empty array
    }),
  );

  it(
    'should test mapToProductListResponseDto with variation without sizes (line 179)',
    runWithRollbackTransaction(async () => {
      // Create a product with variation but no sizes
      const productWithVariationWithoutSizes = {
        id: 1,
        publicId: 'test-1',
        name: 'Product With Variation Without Sizes',
        active: true,
        collection: {
          publicId: 'collection-1',
          name: 'Collection 1',
          active: true,
          description: 'Test collection',
          imageUrl: 'test.jpg',
        },
        variations: [
          {
            publicId: 'variation-1',
            color: 'Red',
            name: 'Red Variation',
            price: '99.90',
            images: ['image1.jpg'],
            sizes: null, // No sizes to test line 179
          },
        ],
      };

      // Use reflection to access private method
      const mapToProductListResponseDto = (
        service as any
      ).mapToProductListResponseDto.bind(service);
      const result = mapToProductListResponseDto(
        productWithVariationWithoutSizes,
      );

      expect(result).toBeDefined();
      expect(result.publicId).toBe('test-1');
      expect(result.name).toBe('Product With Variation Without Sizes');
      expect(result.variations).toHaveLength(1);
      expect(result.variations[0].sizes).toEqual([]); // Should be empty array
    }),
  );

  it(
    'should test mapToProductListResponseDto with product without collection',
    runWithRollbackTransaction(async () => {
      // Create a product without collection
      const productWithoutCollection = {
        id: 1,
        publicId: 'test-1',
        name: 'Product Without Collection',
        active: true,
        collection: null, // No collection
        variations: [],
      };

      // Use reflection to access private method
      const mapToProductListResponseDto = (
        service as any
      ).mapToProductListResponseDto.bind(service);
      const result = mapToProductListResponseDto(productWithoutCollection);

      expect(result).toBeDefined();
      expect(result.publicId).toBe('test-1');
      expect(result.name).toBe('Product Without Collection');
      expect(result.collection).toBeUndefined();
      expect(result.variations).toEqual([]);
    }),
  );
});
