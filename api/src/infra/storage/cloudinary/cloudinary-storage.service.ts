import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryStorageInterface } from './cloudinary.interface';

@Injectable()
export class CloudinaryStorageService implements CloudinaryStorageInterface {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // istanbul ignore next
  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: filename,
          folder: 'beewear', // opcional
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Gera URL completa para a imagem no Cloudinary
   */
  getImageUrl(filename: string): string {
    // O Cloudinary já retorna a URL completa no upload
    return filename;
  }

  /**
   * Verifica se uma imagem existe no Cloudinary
   */
  async imageExists(filename: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(filename);
      return true;
    } catch (error) {
      return false;
    }
  }
}
