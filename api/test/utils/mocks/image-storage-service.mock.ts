import { ImageStorageService } from 'src/infra/storage/image-storage.service';

export const mockImageStorageService: Partial<ImageStorageService> = {
  upload: jest.fn().mockResolvedValue('https://mocked-url.com/image.png'),
};
