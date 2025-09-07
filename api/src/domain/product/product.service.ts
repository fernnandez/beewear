import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Collection } from './collection/collection.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDetailsResponseDto } from './dto/product-details-response.dto';
import { ProductListResponseDto } from './dto/product-list-response.dto';
import { StockDashboardDto } from './dto/stock-dashboard.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { Size } from './productVariation/product-variation-size.entity';
import { ProductVariationService } from './productVariation/product-variation.service';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../shared/dto/pagination.dto';
import { ProductFilterDto } from '../../shared/dto/filter.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    @Inject(ProductVariationService)
    private readonly productVariationService: ProductVariationService,
  ) {}

  @Transactional()
  async create(dto: CreateProductDto): Promise<Product> {
    const collection = await this.collectionRepo.findOne({
      where: { publicId: dto.collectionPublicId },
    });

    if (!collection) {
      throw new NotFoundException('Coleção não encontrada');
    }

    Logger.log(`Criando produto ${dto.name}`);

    const product = this.productRepo.create({
      name: dto.name,
      active: dto.active,
      collection: collection,
    });
    const savedProduct = await this.productRepo.save(product);

    for (const variationDto of dto.variations) {
      Logger.log(
        `Criando variação ${variationDto.name} para o produto ${savedProduct.name}`,
      );
      await this.productVariationService.createProductVariation(
        savedProduct,
        variationDto,
      );
    }

    return savedProduct;
  }

  async findAll() {
    return this.productRepo.find({
      relations: {
        variations: true,
        collection: true,
      },
    });
  }

  async findAllPaginated(
    pagination: PaginationDto,
    filters: ProductFilterDto,
  ): Promise<PaginatedResponseDto<ProductListResponseDto>> {
    const { page = 1, limit = 10 } = pagination;
    const {
      search,
      active,
      collectionId,
      minPrice,
      maxPrice,
      colors,
      sizes,
      startDate,
      endDate,
    } = filters;

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.collection', 'collection')
      .leftJoinAndSelect('product.variations', 'variations')
      .leftJoinAndSelect('variations.sizes', 'sizes')
      .leftJoinAndSelect('sizes.stock', 'stock');

    // Aplicar filtros
    if (search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('product.active = :active', { active });
    }

    if (collectionId) {
      queryBuilder.andWhere('collection.publicId = :collectionId', {
        collectionId,
      });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('variations.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('variations.price <= :maxPrice', { maxPrice });
    }

    if (colors && colors.length > 0) {
      queryBuilder.andWhere('variations.color IN (:...colors)', { colors });
    }

    if (sizes && sizes.length > 0) {
      queryBuilder.andWhere('sizes.size IN (:...sizes)', { sizes });
    }

    if (startDate) {
      queryBuilder.andWhere('product.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('product.createdAt <= :endDate', { endDate });
    }

    // Ordenação padrão por data de criação (mais recentes primeiro)
    queryBuilder.orderBy('product.createdAt', 'DESC');

    // Aplicar paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Executar consulta
    const [products, total] = await queryBuilder.getManyAndCount();

    // Mapear para DTO de resposta
    const productListDtos = products.map((product) =>
      this.mapToProductListResponseDto(product),
    );

    return new PaginatedResponseDto(productListDtos, total, page, limit);
  }

  private mapToProductListResponseDto(
    product: Product,
  ): ProductListResponseDto {
    return {
      publicId: product.publicId,
      name: product.name,
      active: product.active,
      collection: product.collection
        ? {
            publicId: product.collection.publicId,
            name: product.collection.name,
            active: product.collection.active,
            description: product.collection.description,
            imageUrl: product.collection.imageUrl,
          }
        : undefined,
      variations:
        product.variations?.map((variation) => ({
          publicId: variation.publicId,
          color: variation.color,
          name: variation.name,
          price: variation.price,
          images: variation.images || [],
          sizes:
            variation.sizes?.map((size) => ({
              size: size.size,
              stock: {
                quantity: size.stock?.quantity || 0,
              },
            })) || [],
        })) || [],
    };
  }

  async getProductDetailsByPublicId(publicId: string): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { publicId },
      relations: {
        variations: {
          sizes: {
            stock: true,
          },
        },
        collection: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    let totalStock = 0;
    let totalValue = 0;

    const variations = product.variations.map((variation) => {
      const quantity = variation.sizes.reduce(
        (sum, size) => sum + size.stock.quantity,
        0,
      );
      const value = quantity * Number(variation.price);

      totalStock += quantity;
      totalValue += value;

      return {
        publicId: variation.publicId,
        color: variation.color,
        name: variation.name,
        sizes: variation.sizes.map((size) => ({
          size: size.size,
          stock: size.stock,
        })),
        images: variation.images,
        price: Number(variation.price),
        stock: quantity,
      };
    });

    return {
      id: product.id,
      publicId: product.publicId,
      name: product.name,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      aggregations: {
        totalStock,
        totalValue,
      },
      collection: product.collection,
      variations,
    };
  }

  async updateStatus(publicId: string, isActive: boolean): Promise<Product> {
    const product = await this.productRepo.findOneBy({ publicId });
    if (!product) throw new NotFoundException('Produto não encontrado');

    product.active = isActive;
    return this.productRepo.save(product);
  }

  async update(publicId: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOneBy({ publicId });

    if (!product) throw new NotFoundException('Produto não encontrado');

    this.productRepo.merge(product, dto);
    return this.productRepo.save(product);
  }

  async delete(publicId: string) {
    const product = await this.productRepo.findOneBy({ publicId });

    if (!product) throw new NotFoundException('Produto não encontrado');

    await this.productRepo.remove(product);
  }

  // TODO: implementar cobertura para essa função
  /* istanbul ignore next */
  async getStockDashboard(): Promise<StockDashboardDto> {
    const products = await this.productRepo.find({
      relations: {
        collection: true,
        variations: {
          sizes: {
            stock: {
              movements: true,
            },
          },
        },
      },
    });

    let totalProducts = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let noStockCount = 0;

    const lowStockAlerts: {
      name: string;
      category: string;
      size: Size;
      stock: number;
      minStock: number;
    }[] = [];

    const noStockAlerts: {
      name: string;
      category: string;
      size: Size;
      stock: number;
      minStock: number;
    }[] = [];

    const recentMovementsFlat: {
      createdAt: Date;
      productName: string;
      type: 'Compra' | 'Venda';
      quantity: number;
    }[] = [];

    for (const product of products) {
      for (const variation of product.variations) {
        for (const size of variation.sizes) {
          const stock = size.stock;
          if (!stock) continue;

          const qty = stock.quantity;
          const min = 5;

          totalProducts += 1;
          totalValue += qty * Number(variation.price);

          if (qty === 0) {
            noStockCount += 1;
            noStockAlerts.push({
              name: product.name,
              category: product.collection?.name ?? 'Sem coleção',
              size: size.size,
              stock: qty,
              minStock: min,
            });
          } else if (qty < min) {
            lowStockCount += 1;
            lowStockAlerts.push({
              name: product.name,
              category: product.collection?.name ?? 'Sem coleção',
              size: size.size,
              stock: qty,
              minStock: min,
            });
          }

          // pegar os últimos movimentos (no plano local)
          const sortedMovements = [...(stock.movements ?? [])].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );

          for (const m of sortedMovements.slice(0, 1)) {
            if (m.description != 'Estoque inicial') {
              recentMovementsFlat.push({
                createdAt: m.createdAt,
                productName: product.name,
                type: m.type === 'IN' ? 'Compra' : 'Venda',
                quantity: m.type === 'IN' ? m.quantity : -m.quantity,
              });
            }
          }
        }
      }
    }

    const recentMovements = recentMovementsFlat
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((m) => ({
        productName: m.productName,
        date: m.createdAt.toISOString().split('T')[0],
        type: m.type,
        quantity: m.quantity,
      }));

    return {
      summary: {
        totalProducts,
        totalValue,
        lowStockCount,
        noStockCount,
      },
      noStockAlerts,
      lowStockAlerts,
      recentMovements,
    };
  }

  // Métodos para o frontend
  async findAllForFrontend(): Promise<ProductListResponseDto[]> {
    const products = await this.productRepo.find({
      where: { active: true },
      relations: {
        variations: {
          sizes: {
            stock: true,
          },
        },
        collection: true,
      },
    });

    return products.map((product) => this.mapToProductListResponse(product));
  }

  async getProductDetailsForFrontend(
    publicId: string,
  ): Promise<ProductDetailsResponseDto> {
    const product = await this.productRepo.findOne({
      where: { publicId, active: true },
      relations: {
        variations: {
          sizes: {
            stock: true,
          },
        },
        collection: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.mapToProductDetailsResponse(product);
  }

  private mapToProductListResponse(product: Product): ProductListResponseDto {
    return {
      publicId: product.publicId,
      name: product.name,
      active: product.active,
      collection: product.collection
        ? {
            publicId: product.collection.publicId,
            name: product.collection.name,
            active: product.collection.active,
            description: product.collection.description,
            imageUrl: product.collection.imageUrl,
          }
        : undefined,
      variations: product.variations.map((variation) => ({
        publicId: variation.publicId,
        color: variation.color,
        name: variation.name,
        price: Number(variation.price),
        images: variation.images,
        sizes: variation.sizes.map((size) => ({
          publicId: size.publicId,
          size: size.size,
          stock: {
            quantity: size.stock.quantity,
          },
        })),
      })),
    };
  }

  private mapToProductDetailsResponse(
    product: Product,
  ): ProductDetailsResponseDto {
    return this.mapToProductListResponse(product);
  }
}
