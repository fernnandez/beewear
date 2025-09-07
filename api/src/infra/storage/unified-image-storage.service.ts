import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryImageStorageService } from './cloudinary-image-storage.service';
import { LocalImageStorageService } from './local-image-storage.service';
import { ImageStorageService } from './image-storage.service';

@Injectable()
export class UnifiedImageStorageService implements ImageStorageService {
  private readonly logger = new Logger(UnifiedImageStorageService.name);
  private readonly isProduction: boolean;

  constructor(
    private readonly cloudinaryService: CloudinaryImageStorageService,
    private readonly localService: LocalImageStorageService,
  ) {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logger.log(
      `Usando armazenamento: ${this.isProduction ? 'Cloudinary' : 'Local'}`,
    );
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    if (this.isProduction) {
      this.logger.debug(`Uploading to Cloudinary: ${filename}`);
      return this.cloudinaryService.upload(fileBuffer, filename);
    } else {
      this.logger.debug(`Saving locally: ${filename}`);
      // Para desenvolvimento local, apenas retorna o nome do arquivo
      // O arquivo já deve existir na pasta test/utils/files
      return filename;
    }
  }

  /**
   * Gera URL completa para a imagem baseada no ambiente
   */
  getImageUrl(filename: string): string {
    if (this.isProduction) {
      // Em produção, retorna a URL do Cloudinary
      return filename; // O Cloudinary já retorna a URL completa
    } else {
      // Em desenvolvimento, retorna URL local
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      return `${baseUrl}/uploads/images/${filename}`;
    }
  }

  /**
   * Verifica se uma imagem existe localmente (apenas para desenvolvimento)
   */
  async imageExists(filename: string): Promise<boolean> {
    if (this.isProduction) {
      return true; // Assume que existe no Cloudinary
    }

    const fs = await import('fs');
    const path = await import('path');
    const imagePath = path.join(process.cwd(), 'test/utils/files', filename);
    return fs.existsSync(imagePath);
  }
}
