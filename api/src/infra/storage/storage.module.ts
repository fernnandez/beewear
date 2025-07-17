import { Module } from '@nestjs/common';
import { CloudinaryImageStorageService } from './cloudinary-image-storage.service';

@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      // TODO: usar useFactory para determinar implementação com base no env
      useClass: CloudinaryImageStorageService,
    },
  ],
  exports: ['ImageStorageService'],
})
export class StorageModule {}
