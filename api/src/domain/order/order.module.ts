import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../user/address/address.entity';
import { User } from '../user/user.entity';
import { ProductModule } from '../product/product.module';
import { PaymentModule } from '../../integration/payment/payment.module';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Address]),
    ProductModule,
    PaymentModule,
  ],
  providers: [OrderService],
  controllers: [OrderController, PaymentController],
  exports: [OrderService],
})
export class OrderModule {}
