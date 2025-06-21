import { Module } from '@nestjs/common';
import { StorageModule } from 'src/infra/storage/storage.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [StorageModule],
  controllers: [UploadController],
})
export class UploadModule {}
