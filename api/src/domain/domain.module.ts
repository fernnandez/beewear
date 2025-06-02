import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ProductModule, StockModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
