import { Module } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [
    LocalStorageService,
    {
      provide: 'LocalStorageProvider',
      useClass: LocalStorageService,
    },
  ],
  exports: [LocalStorageService, 'LocalStorageProvider'],
})
export class LocalModule {}
