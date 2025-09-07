export interface CloudinaryStorageInterface {
  upload(fileBuffer: Buffer, filename: string): Promise<string>;
  getImageUrl(filename: string): string;
  imageExists(filename: string): Promise<boolean>;
}
