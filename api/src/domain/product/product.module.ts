import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection/collection.controller';
import { Collection } from './collection/collection.entity';
import { CollectionService } from './collection/collection.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductVariation } from './productVariation/product-variation.entity';
import { StockItem } from './stock/stock-item.entity';
import { StockMovement } from './stock/stock-movement.entity';
import { StockService } from './stock/stock.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariation,
      Collection,
      StockItem,
      StockMovement,
    ]),
  ],
  providers: [ProductService, StockService, CollectionService],
  controllers: [ProductController, CollectionController],
})
export class ProductModule {}
