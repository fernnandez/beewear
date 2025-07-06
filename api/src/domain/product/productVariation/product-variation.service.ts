import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { StockService } from '../stock/stock.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationImagesDto } from './dto/update-product-variation-images.dto';
import { ProductVariationSize, Size } from './product-variation-size.entity';
import { ProductVariation } from './product-variation.entity';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

@Injectable()
export class ProductVariationService {
  constructor(
    @InjectRepository(ProductVariation)
    private readonly productVariationRepo: Repository<ProductVariation>,
    @InjectRepository(ProductVariationSize)
    private readonly ProductVariationSizeRepo: Repository<ProductVariationSize>,
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  async createProductVariation(
    product: Product,
    variationDto: CreateProductVariationDto,
  ): Promise<ProductVariation> {
    console.log(product);

    const savedVariation = await this.productVariationRepo.save({
      ...variationDto,
      product: product,
      images: variationDto.images || [],
    });

    const allSizes = Object.values(Size);
    for (const size of allSizes) {
      const productVariationSize = this.ProductVariationSizeRepo.create({
        size,
        productVariation: savedVariation,
      });
      const savedProductVariationSize =
        await this.ProductVariationSizeRepo.save(productVariationSize);
      await this.stockService.createInitialStock(savedProductVariationSize, 0);
    }

    return savedVariation;
  }

  async deleteProductVariation(
    productVariationPublicId: string,
  ): Promise<void> {
    const variation = await this.productVariationRepo.findOne({
      where: { publicId: productVariationPublicId },
    });

    if (!variation) {
      throw new NotFoundException(
        `Variação "${productVariationPublicId}" não encontrada.`,
      );
    }

    await this.productVariationRepo.remove(variation);
  }

  async updateProductVariation(
    variationPublicId: string,
    dto: UpdateProductVariationDto,
  ): Promise<ProductVariation> {
    const variation = await this.productVariationRepo.findOne({
      where: { publicId: variationPublicId },
    });

    if (!variation) {
      throw new NotFoundException(
        `Variação com PublicId "${variationPublicId}" não encontrada.`,
      );
    }
    Object.assign(variation, dto);

    return this.productVariationRepo.save(variation);
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
