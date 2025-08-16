import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CollectionModule } from './product/collection/collection.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CollectionModule,
    UploadModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class DomainModule {}
