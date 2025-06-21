import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ProductModule, UploadModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
