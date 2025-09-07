import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CloudinaryStorageInterface } from '../src/infra/storage/cloudinary/cloudinary.interface';
import { LocalStorageInterface } from '../src/infra/storage/local/local.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageSeederService {
  private readonly logger = new Logger(ImageSeederService.name);

  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService:
      | CloudinaryStorageInterface
      | LocalStorageInterface,
  ) {}

  /**
   * Obtém imagens aleatórias da pasta files (excluindo banners)
   */
  getRandomImages(count: number): string[] {
    const imagesDir = path.join(process.cwd(), 'test/utils/files');
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
   * Usa o serviço de storage configurado (Cloudinary ou Local)
   */
  async processImageForSeeding(filename: string): Promise<string> {
    const imagePath = path.join(process.cwd(), 'test/utils/files', filename);

    if (!fs.existsSync(imagePath)) {
      this.logger.warn(`Imagem não encontrada: ${filename}`);
      // Fallback para URL completa usando o serviço
      return this.imageStorageService.getImageUrl(filename);
    }

    const fileBuffer = fs.readFileSync(imagePath);
    const imageUrl = await this.imageStorageService.upload(
      fileBuffer,
      filename,
    );

    this.logger.debug(`Processed image: ${filename} -> ${imageUrl}`);
    return imageUrl;
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
   * Gera URL completa para a imagem usando o serviço de storage
   */
  getImageUrl(filename: string): string {
    return this.imageStorageService.getImageUrl(filename);
  }

  /**
   * Verifica se uma imagem existe usando o serviço de storage
   */
  async imageExists(filename: string): Promise<boolean> {
    return this.imageStorageService.imageExists(filename);
  }

  /**
   * Lista todas as imagens disponíveis (excluindo banners)
   */
  getAvailableImages(): string[] {
    const imagesDir = path.join(process.cwd(), 'test/utils/files');
    return fs
      .readdirSync(imagesDir)
      .filter(
        (file) =>
          /\.(jpg|jpeg|png)$/i.test(file) &&
          !file.toLowerCase().includes('banner'),
      );
  }
}
