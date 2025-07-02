import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ImageStorageService } from './image-storage.service';

// TODO: migrar para s3 ou similar com outro serviço
@Injectable()
export class LocalImageStorageService implements ImageStorageService {
  async upload(file: Express.Multer.File): Promise<{ imageUrl: string }> {
    // Garante que a pasta exista
    const uploadDir = join(process.cwd(), 'uploads/images');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    console.log(file)

    return {
      imageUrl: `${file.filename}`,
    };
  }
}
