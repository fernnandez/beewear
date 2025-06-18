import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection/collection.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductVariation } from './productVariation/product-variation.entity';
import { StockService } from './stock/stock.service';
import { StockItem } from './stock/stock-item.entity';
import { StockMovement } from './stock/stock-movement.entity';

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
  providers: [ProductService, StockService],
  controllers: [ProductController],
})
export class ProductModule {}
