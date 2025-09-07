import { Module } from '@nestjs/common';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Module({
  providers: [
    CloudinaryStorageService,
    {
      provide: 'CloudinaryStorageProvider',
      useClass: CloudinaryStorageService,
    },
  ],
  exports: [CloudinaryStorageService, 'CloudinaryStorageProvider'],
})
export class CloudinaryModule {}
