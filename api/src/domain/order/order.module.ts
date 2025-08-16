import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../user/address/address.entity';
import { User } from '../user/user.entity';
import { ProductModule } from '../product/product.module';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Address]),
    ProductModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
