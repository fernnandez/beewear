export interface ImageStorageService {
  upload(file: Express.Multer.File): Promise<{ imageUrl: string }>;
}
