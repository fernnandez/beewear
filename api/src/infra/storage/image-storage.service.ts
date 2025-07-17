export interface ImageStorageService {
  upload(fileBuffer: Buffer, filename: string): Promise<string>;
}
