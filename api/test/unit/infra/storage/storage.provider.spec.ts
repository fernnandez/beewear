import { STORAGE_PROVIDER } from 'src/infra/storage/storage.provider';
import { CloudinaryStorageInterface } from 'src/infra/storage/cloudinary/cloudinary.interface';
import { LocalStorageInterface } from 'src/infra/storage/local/local.interface';

describe('StorageProvider', () => {
  let cloudinaryProvider: CloudinaryStorageInterface;
  let localProvider: LocalStorageInterface;

  beforeEach(() => {
    // Mock dos providers
    cloudinaryProvider = {
      upload: jest.fn(),
      getImageUrl: jest.fn(),
      imageExists: jest.fn(),
    };

    localProvider = {
      upload: jest.fn(),
      getImageUrl: jest.fn(),
      imageExists: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('factory function', () => {
    it('deve retornar cloudinaryProvider em ambiente de produção', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const factory = (STORAGE_PROVIDER as any).useFactory as (
        cloudinaryProvider: CloudinaryStorageInterface,
        localProvider: LocalStorageInterface,
      ) => CloudinaryStorageInterface | LocalStorageInterface;
      const result = factory(cloudinaryProvider, localProvider);

      expect(result).toBe(cloudinaryProvider);
      expect(result).not.toBe(localProvider);

      process.env.NODE_ENV = originalEnv;
    });

    it('deve retornar localProvider em ambiente de desenvolvimento', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const factory = (STORAGE_PROVIDER as any).useFactory as (
        cloudinaryProvider: CloudinaryStorageInterface,
        localProvider: LocalStorageInterface,
      ) => CloudinaryStorageInterface | LocalStorageInterface;
      const result = factory(cloudinaryProvider, localProvider);

      expect(result).toBe(localProvider);
      expect(result).not.toBe(cloudinaryProvider);

      process.env.NODE_ENV = originalEnv;
    });

    it('deve retornar localProvider quando NODE_ENV não está definido', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      const factory = (STORAGE_PROVIDER as any).useFactory as (
        cloudinaryProvider: CloudinaryStorageInterface,
        localProvider: LocalStorageInterface,
      ) => CloudinaryStorageInterface | LocalStorageInterface;
      const result = factory(cloudinaryProvider, localProvider);

      expect(result).toBe(localProvider);
      expect(result).not.toBe(cloudinaryProvider);

      process.env.NODE_ENV = originalEnv;
    });

    it('deve retornar localProvider quando NODE_ENV é undefined', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = undefined;

      const factory = (STORAGE_PROVIDER as any).useFactory as (
        cloudinaryProvider: CloudinaryStorageInterface,
        localProvider: LocalStorageInterface,
      ) => CloudinaryStorageInterface | LocalStorageInterface;
      const result = factory(cloudinaryProvider, localProvider);

      expect(result).toBe(localProvider);
      expect(result).not.toBe(cloudinaryProvider);

      process.env.NODE_ENV = originalEnv;
    });

    it('deve retornar localProvider quando NODE_ENV é string vazia', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = '';

      const factory = (STORAGE_PROVIDER as any).useFactory as (
        cloudinaryProvider: CloudinaryStorageInterface,
        localProvider: LocalStorageInterface,
      ) => CloudinaryStorageInterface | LocalStorageInterface;
      const result = factory(cloudinaryProvider, localProvider);

      expect(result).toBe(localProvider);
      expect(result).not.toBe(cloudinaryProvider);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('provider configuration', () => {
    it('deve ter o token correto', () => {
      expect((STORAGE_PROVIDER as any).provide).toBe('ImageStorageService');
    });

    it('deve injetar os providers corretos', () => {
      expect((STORAGE_PROVIDER as any).inject).toEqual([
        'CloudinaryStorageProvider',
        'LocalStorageProvider',
      ]);
    });

    it('deve ter uma factory function', () => {
      expect(typeof (STORAGE_PROVIDER as any).useFactory).toBe('function');
    });
  });
});
