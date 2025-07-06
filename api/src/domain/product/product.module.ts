import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection/collection.controller';
import { Collection } from './collection/collection.entity';
import { CollectionService } from './collection/collection.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductVariationController } from './productVariation/produc-variation.controller';
import { ProductVariationSize } from './productVariation/product-variation-size.entity';
import { ProductVariation } from './productVariation/product-variation.entity';
import { ProductVariationService } from './productVariation/product-variation.service';
import { StockItem } from './stock/stock-item.entity';
import { StockMovement } from './stock/stock-movement.entity';
import { StockService } from './stock/stock.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariation,
      ProductVariationSize,
      Collection,
      StockItem,
      StockMovement,
    ]),
  ],
  providers: [
    ProductService,
    ProductVariationService,
    StockService,
    CollectionService,
  ],
  controllers: [
    ProductController,
    ProductVariationController,
    CollectionController,
  ],
})
export class ProductModule {}
