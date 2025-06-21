import * as fs from 'fs';
import { join } from 'path';
import { LocalImageStorageService } from 'src/infra/storage/local-image-storage.service';

jest.mock('fs');

describe('LocalImageStorageService', () => {
  let service: LocalImageStorageService;

  beforeEach(() => {
    service = new LocalImageStorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar a pasta se não existir', async () => {
    const mockFile = {
      filename: 'teste.png',
    } as Express.Multer.File;

    const uploadDir = join(process.cwd(), 'uploads/images');

    // Mocks
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const mkdirSpy = fs.mkdirSync as jest.Mock;

    const result = await service.upload(mockFile);

    expect(fs.existsSync).toHaveBeenCalledWith(uploadDir);
    expect(mkdirSpy).toHaveBeenCalledWith(uploadDir, { recursive: true });
    expect(result).toEqual({ imageUrl: 'teste.png' });
  });

  it('não deve criar a pasta se ela já existir', async () => {
    const mockFile = {
      filename: 'teste.png',
    } as Express.Multer.File;

    const uploadDir = join(process.cwd(), 'uploads/images');

    // Mocks
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const mkdirSpy = fs.mkdirSync as jest.Mock;

    const result = await service.upload(mockFile);

    expect(fs.existsSync).toHaveBeenCalledWith(uploadDir);
    expect(mkdirSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ imageUrl: 'teste.png' });
  });
});
