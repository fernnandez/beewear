import { Module } from '@nestjs/common';
import { CloudinaryImageStorageService } from './cloudinary-image-storage.service';
import { LocalImageStorageService } from './local-image-storage.service';
import { UnifiedImageStorageService } from './unified-image-storage.service';
import { ImageServeController } from './image-serve.controller';

@Module({
  controllers: [ImageServeController],
  providers: [
    CloudinaryImageStorageService,
    LocalImageStorageService,
    {
      provide: 'ImageStorageService',
      useFactory: (
        cloudinaryService: CloudinaryImageStorageService,
        localService: LocalImageStorageService,
      ) => {
        return new UnifiedImageStorageService(cloudinaryService, localService);
      },
      inject: [CloudinaryImageStorageService, LocalImageStorageService],
    },
  ],
  exports: ['ImageStorageService'],
})
export class StorageModule {}
