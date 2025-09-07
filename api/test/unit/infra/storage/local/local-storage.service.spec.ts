import * as fs from 'fs';
import { join } from 'path';
import { LocalStorageService } from 'src/infra/storage/local/local-storage.service';

jest.mock('fs');

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('deve retornar o nome do arquivo para desenvolvimento local', async () => {
      const fileBuffer = Buffer.from('test image data');
      const filename = 'teste.png';

      const result = await service.upload(fileBuffer, filename);

      expect(result).toBe(`http://localhost:3000/uploads/images/${filename}`);
    });
  });

  describe('getImageUrl', () => {
    it('deve gerar URL local com base URL padrão', () => {
      const filename = 'teste.png';
      const result = service.getImageUrl(filename);

      expect(result).toBe('http://localhost:3000/uploads/images/teste.png');
    });

    it('deve usar API_BASE_URL do ambiente se definido', () => {
      const originalBaseUrl = process.env.API_BASE_URL;
      process.env.API_BASE_URL = 'https://api.example.com';

      const filename = 'teste.png';
      const result = service.getImageUrl(filename);

      expect(result).toBe('https://api.example.com/uploads/images/teste.png');

      // Restaurar valor original
      if (originalBaseUrl) {
        process.env.API_BASE_URL = originalBaseUrl;
      } else {
        delete process.env.API_BASE_URL;
      }
    });
  });

  describe('imageExists', () => {
    it('deve retornar true se o arquivo existe localmente', async () => {
      const filename = 'teste.png';
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = await service.imageExists(filename);

      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith(
        join(process.cwd(), 'test/utils/files', filename),
      );
    });

    it('deve retornar false se o arquivo não existe localmente', async () => {
      const filename = 'teste.png';
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await service.imageExists(filename);

      expect(result).toBe(false);
      expect(fs.existsSync).toHaveBeenCalledWith(
        join(process.cwd(), 'test/utils/files', filename),
      );
    });
  });
});
