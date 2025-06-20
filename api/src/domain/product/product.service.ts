import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Collection } from './collection/collection.entity';
import { CreateProductDto } from './create-product.dto';
import { Product } from './product.entity';
import { ProductVariation } from './productVariation/product-variation.entity';
import { StockService } from './stock/stock.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariation)
    private readonly productVariationRepo: Repository<ProductVariation>,
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
      const { initialStock } = variationDto;

      Logger.log(`Criando variação ${variationDto.color}-${variationDto.size}`);
      const variation = await this.productVariationRepo.save({
        color: variationDto.color,
        size: variationDto.size,
        price: variationDto.price,
        product,
      });

      await this.stockService.createInitialStock(variation, initialStock);
    }

    return product;
  }
}
