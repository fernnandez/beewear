import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../user/address/address.entity';
import { User } from '../user/user.entity';
import { ProductVariation } from '../product/productVariation/product-variation.entity';
import { ProductVariationSize } from '../product/productVariation/product-variation-size.entity';
import { StockItem } from '../product/stock/stock-item.entity';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      User,
      Address,
      ProductVariation,
      ProductVariationSize,
      StockItem,
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
