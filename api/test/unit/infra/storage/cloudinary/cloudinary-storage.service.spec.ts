import { CloudinaryStorageService } from 'src/infra/storage/cloudinary/cloudinary-storage.service';

// Mock do Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
    api: {
      resource: jest.fn(),
    },
  },
}));

// Mock do stream
jest.mock('stream', () => ({
  Readable: {
    from: jest.fn().mockReturnValue({
      pipe: jest.fn(),
    }),
  },
}));

describe('CloudinaryStorageService', () => {
  let service: CloudinaryStorageService;
  let mockCloudinary: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock das variáveis de ambiente
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    service = new CloudinaryStorageService();

    // Obter referência ao mock do cloudinary
    const cloudinary = jest.requireMock('cloudinary');
    mockCloudinary = cloudinary.v2;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('deve configurar o Cloudinary com as variáveis de ambiente', () => {
      expect(mockCloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret',
      });
    });
  });

  describe('upload', () => {
    it('deve fazer upload do arquivo para o Cloudinary', async () => {
      const fileBuffer = Buffer.from('test image data');
      const filename = 'test-image.png';
      const mockSecureUrl =
        'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/test-image.png';

      // Mock da resposta do Cloudinary
      mockCloudinary.uploader.upload_stream.mockImplementation(
        (options, callback) => {
          // Simular callback de sucesso
          callback(null, { secure_url: mockSecureUrl });
          return { pipe: jest.fn() };
        },
      );

      const result = await service.upload(fileBuffer, filename);

      expect(result).toBe(mockSecureUrl);
      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        {
          public_id: filename,
          folder: 'beewear',
        },
        expect.any(Function),
      );
    });

    it('deve rejeitar com erro se o upload falhar', async () => {
      const fileBuffer = Buffer.from('test image data');
      const filename = 'test-image.png';
      const mockError = new Error('Upload failed');

      mockCloudinary.uploader.upload_stream.mockImplementation(
        (options, callback) => {
          callback(mockError, null);
          return { pipe: jest.fn() };
        },
      );

      await expect(service.upload(fileBuffer, filename)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('getImageUrl', () => {
    it('deve retornar a URL fornecida (Cloudinary já retorna URL completa)', () => {
      const filename =
        'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/test-image.png';

      const result = service.getImageUrl(filename);

      expect(result).toBe(filename);
    });
  });

  describe('imageExists', () => {
    it('deve retornar true se a imagem existe no Cloudinary', async () => {
      const filename = 'test-image.png';

      mockCloudinary.api.resource.mockResolvedValue({
        public_id: filename,
        format: 'png',
        bytes: 1024,
      });

      const result = await service.imageExists(filename);

      expect(result).toBe(true);
      expect(mockCloudinary.api.resource).toHaveBeenCalledWith(filename);
    });

    it('deve retornar false se a imagem não existe no Cloudinary', async () => {
      const filename = 'non-existent-image.png';

      mockCloudinary.api.resource.mockRejectedValue(
        new Error('Resource not found'),
      );

      const result = await service.imageExists(filename);

      expect(result).toBe(false);
      expect(mockCloudinary.api.resource).toHaveBeenCalledWith(filename);
    });

    it('deve retornar false se ocorrer qualquer erro na verificação', async () => {
      const filename = 'test-image.png';

      mockCloudinary.api.resource.mockRejectedValue(new Error('Network error'));

      const result = await service.imageExists(filename);

      expect(result).toBe(false);
    });
  });
});
