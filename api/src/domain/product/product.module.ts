import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection/collection.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductVariationController } from './productVariation/produc-variation.controller';
import { ProductVariationSize } from './productVariation/product-variation-size.entity';
import { ProductVariation } from './productVariation/product-variation.entity';
import { ProductVariationService } from './productVariation/product-variation.service';
import { PublicProductController } from './public-product.controller';
import { StockItem } from './stock/stock-item.entity';
import { StockMovement } from './stock/stock-movement.entity';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Collection,
      ProductVariation,
      ProductVariationSize,
      StockItem,
      StockMovement,
    ]),
  ],
  controllers: [
    ProductController,
    PublicProductController,
    ProductVariationController,
    StockController,
  ],
  providers: [ProductService, ProductVariationService, StockService],
  exports: [ProductService],
})
export class ProductModule {}
