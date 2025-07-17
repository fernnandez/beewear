import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// TODO: migrar para s3 ou similar com outro serviço
@Injectable()
export class LocalImageStorageService {
  async upload(file: Express.Multer.File): Promise<{ imageUrl: string }> {
    // Garante que a pasta exista
    const uploadDir = join(process.cwd(), 'uploads/images');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    return {
      imageUrl: `${file.filename}`,
    };
  }
}
