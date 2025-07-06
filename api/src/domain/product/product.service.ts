import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Collection } from './collection/collection.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductVariationService } from './productVariation/product-variation.service';

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
}
