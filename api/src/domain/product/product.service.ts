import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Collection } from './collection/collection.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductVariationImagesDto } from './dto/update-product-variation-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductVariationSize } from './productVariation/product-variation-size.entity';
import { ProductVariation } from './productVariation/product-variation.entity';
import { StockService } from './stock/stock.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariation)
    private readonly productVariationRepo: Repository<ProductVariation>,
    @InjectRepository(ProductVariationSize)
    private readonly ProductVariationSize: Repository<ProductVariationSize>,
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  @Transactional()
  async create(dto: CreateProductDto) {
    const collection = await this.collectionRepo.findOne({
      where: { publicId: dto.collectionPublicId },
    });

    if (!collection) {
      throw new NotFoundException('Coleção não encontrada');
    }

    Logger.log(`Criando produto ${dto.name}`);

    const product = await this.productRepo.save({
      name: dto.name,
      active: dto.active,
      collection,
    });

    for (const variationDto of dto.variations) {
      const { sizes } = variationDto;

      Logger.log(`Criando variação ${variationDto.name}`);
      const variation = await this.productVariationRepo.save({
        color: variationDto.color,
        name: variationDto.name,
        price: variationDto.price,
        product,
      });

      for (const size of sizes) {
        const productVariationSize = await this.ProductVariationSize.save({
          size,
          productVariation: variation,
        });

        await this.stockService.createInitialStock(productVariationSize, 0);
      }
    }

    return product;
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

  async updateProductVariationImages(
    productVariationPublicId: string,
    dto: UpdateProductVariationImagesDto,
  ) {
    const variation = await this.productVariationRepo.findOneBy({
      publicId: productVariationPublicId,
    });

    if (!variation) {
      throw new NotFoundException(
        `Variação ${productVariationPublicId} não encontrada`,
      );
    }

    await this.productVariationRepo.save({
      ...variation,
      images: Array.from(new Set([...(variation.images ?? []), ...dto.images])),
    });
  }

  async removeProductVariationImage(
    productVariationPublicId: string,
    imageToRemove: string,
  ) {
    const variation = await this.productVariationRepo.findOneBy({
      publicId: productVariationPublicId,
    });

    if (!variation) {
      throw new NotFoundException(
        `Variação ${productVariationPublicId} não encontrada`,
      );
    }

    const updatedImages = variation.images.filter(
      (img) => img !== imageToRemove,
    );

    // Opcional: se quiser validar se a imagem existia antes
    if (updatedImages.length === variation.images.length) {
      throw new NotFoundException(
        `Imagem "${imageToRemove}" não encontrada nessa variação`,
      );
    }

    await this.productVariationRepo.save({
      ...variation,
      images: updatedImages,
    });
  }
}
