import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LocalModule } from './local/local.module';
import { ImageServeController } from './image-serve.controller';
import { STORAGE_PROVIDER } from './storage.provider';

@Module({
  imports: [CloudinaryModule, LocalModule],
  controllers: [ImageServeController],
  providers: [STORAGE_PROVIDER],
  exports: ['ImageStorageService'],
})
export class StorageModule {}
