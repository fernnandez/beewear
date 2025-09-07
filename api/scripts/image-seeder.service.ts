import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ImageStorageService } from '../src/infra/storage/image-storage.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageSeederService {
  private readonly logger = new Logger(ImageSeederService.name);
  private readonly isProduction: boolean;

  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
  ) {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Obtém imagens aleatórias da pasta files (excluindo banners)
   */
  getRandomImages(count: number): string[] {
    const imagesDir = path.join(__dirname, '../test/utils/files');
    const imageFiles = fs
      .readdirSync(imagesDir)
      .filter(
        (file) =>
          /\.(jpg|jpeg|png)$/i.test(file) &&
          !file.toLowerCase().includes('banner'),
      );

    const selectedImages: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomImage =
        imageFiles[Math.floor(Math.random() * imageFiles.length)];
      selectedImages.push(randomImage);
    }

    return selectedImages;
  }

  /**
   * Processa uma imagem para o seeding
   * Em desenvolvimento: retorna URL completa local
   * Em produção: faz upload para Cloudinary
   */
  async processImageForSeeding(filename: string): Promise<string> {
    if (this.isProduction) {
      // Em produção, faz upload para Cloudinary
      const imagePath = path.join(__dirname, '../test/utils/files', filename);

      if (!fs.existsSync(imagePath)) {
        this.logger.warn(`Imagem não encontrada: ${filename}`);
        return filename; // Fallback para o nome do arquivo
      }

      const fileBuffer = fs.readFileSync(imagePath);
      const cloudinaryUrl = await this.imageStorageService.upload(
        fileBuffer,
        filename,
      );
      this.logger.debug(
        `Uploaded to Cloudinary: ${filename} -> ${cloudinaryUrl}`,
      );
      return cloudinaryUrl;
    } else {
      // Em desenvolvimento, retorna URL completa local
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      const localUrl = `${baseUrl}/uploads/images/${filename}`;
      this.logger.debug(`Using local image: ${filename} -> ${localUrl}`);
      return localUrl;
    }
  }

  /**
   * Processa múltiplas imagens para o seeding
   */
  async processImagesForSeeding(filenames: string[]): Promise<string[]> {
    const processedImages: string[] = [];

    for (const filename of filenames) {
      const processedImage = await this.processImageForSeeding(filename);
      processedImages.push(processedImage);
    }

    return processedImages;
  }

  /**
   * Gera URL completa para a imagem baseada no ambiente
   */
  getImageUrl(filename: string): string {
    if (this.isProduction) {
      // Em produção, retorna a URL do Cloudinary (já é completa)
      return filename;
    } else {
      // Em desenvolvimento, retorna URL local
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      return `${baseUrl}/uploads/images/${filename}`;
    }
  }

  /**
   * Verifica se uma imagem existe localmente
   */
  imageExists(filename: string): boolean {
    const imagePath = path.join(__dirname, '../test/utils/files', filename);
    return fs.existsSync(imagePath);
  }

  /**
   * Lista todas as imagens disponíveis (excluindo banners)
   */
  getAvailableImages(): string[] {
    const imagesDir = path.join(__dirname, '../test/utils/files');
    return fs
      .readdirSync(imagesDir)
      .filter(
        (file) =>
          /\.(jpg|jpeg|png)$/i.test(file) &&
          !file.toLowerCase().includes('banner'),
      );
  }
}
