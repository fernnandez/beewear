import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { LocalStorageInterface } from './local.interface';

@Injectable()
export class LocalStorageService implements LocalStorageInterface {
  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    // Para desenvolvimento local, retorna a URL completa da imagem
    // O arquivo já deve existir na pasta test/utils/files
    return this.getImageUrl(filename);
  }

  /**
   * Gera URL completa para a imagem local
   */
  getImageUrl(filename: string): string {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/images/${filename}`;
  }

  /**
   * Verifica se uma imagem existe localmente
   */
  async imageExists(filename: string): Promise<boolean> {
    const imagePath = join(process.cwd(), 'test/utils/files', filename);
    return existsSync(imagePath);
  }
}
