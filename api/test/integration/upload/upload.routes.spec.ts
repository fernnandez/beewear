import { INestApplication, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { join, resolve } from 'path';
import { AppModule } from 'src/app.module';
import { UploadController } from 'src/domain/upload/upload.controller';
import { ImageStorageService } from 'src/infra/storage/image-storage.service';
import * as request from 'supertest';
import { createTestingApp } from 'test/utils/create-testing-app';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('UploadController', () => {
  let controller: UploadController;
  let imageStorageService: ImageStorageService;
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
      providers: [
        {
          provide: 'ImageStorageService',
          useValue: {
            upload: jest.fn(),
          },
        },
      ],
    });

    controller = app.get<UploadController>(UploadController);
    imageStorageService = app.get<ImageStorageService>('ImageStorageService');

    await app.init();
    setupIntegrationMocks(); // mocks de auth, se necessário
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  describe('POST /upload', () => {
    it('should upload file and return response', async () => {
      const filePath = resolve(__dirname, '../../utils/files/test.png');

      const res = await request(app.getHttpServer())
        .post('/upload')
        .attach('file', filePath);

      expect(res.status).toBe(201); // ou o status que seu controller retorna
      expect(res.body).toHaveProperty('imageUrl'); // ou o que seu serviço retorna
    });
  });

  describe('upload', () => {
    it('should call imageStorageService.upload and return result', async () => {
      const mockFile = {
        originalname: 'test.png',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const uploadResult = { imageUrl: 'file.png' };
      jest.spyOn(imageStorageService, 'upload').mockResolvedValue(uploadResult);

      const result = await controller.upload(mockFile);

      expect(imageStorageService.upload).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(uploadResult);
    });
  });

  describe('serveImage', () => {
    let res: Partial<Response>;
    let setHeaderMock: jest.Mock;
    let pipeMock: jest.Mock;

    beforeEach(() => {
      setHeaderMock = jest.fn();
      pipeMock = jest.fn();

      res = {
        setHeader: setHeaderMock,
        write: jest.fn(),
        end: jest.fn(),
        // adicione outros métodos se necessário
      } as unknown as Response;
    });

    beforeAll(() => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      jest.spyOn(fs, 'createReadStream').mockImplementation(
        () =>
          ({
            pipe: pipeMock,
          }) as any,
      );
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should stream the file if exists', async () => {
      const filename = 'exists.png';

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.createReadStream as jest.Mock).mockReturnValue({
        pipe: pipeMock,
      });

      await controller.serveImage(filename, res as Response);

      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining(filename),
      );
      expect(setHeaderMock).toHaveBeenCalledWith(
        'Content-Type',
        expect.any(String),
      );
      expect(pipeMock).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw NotFoundException if file does not exist', async () => {
      const filename = 'notfound.png';

      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(
        controller.serveImage(filename, res as Response),
      ).rejects.toThrow(NotFoundException);

      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining(filename),
      );
    });

    it('should define the correct Content-Type', async () => {
      const filename = 'teste.png';
      const filePath = join(process.cwd(), 'uploads/images', filename);

      const setHeader = jest.fn();
      const pipe = jest.fn();

      const res = { setHeader } as unknown as Response;

      // Simula que o arquivo existe
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      // Simula a stream retornada
      jest.spyOn(fs, 'createReadStream').mockReturnValue({ pipe } as any);

      const lookupSpy = jest.spyOn(mime, 'lookup');

      await controller.serveImage(filename, res);

      expect(fs.existsSync).toHaveBeenCalledWith(filePath);
      expect(mime.lookup).toHaveBeenCalledWith(filePath);
      expect(setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(pipe).toHaveBeenCalledWith(res);
      expect(lookupSpy).toHaveReturnedWith('image/png');
    });

    it('should apply application/octet-stream if MIME type was not found', async () => {
      const filename = 'arquivo-sem-extensao';

      const setHeader = jest.fn();
      const pipe = jest.fn();
      const res = { setHeader } as unknown as Response;

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'createReadStream').mockReturnValue({ pipe } as any);
      jest.spyOn(mime, 'lookup').mockReturnValue(undefined); // força o fallback

      await controller.serveImage(filename, res as Response);

      expect(setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
      expect(pipe).toHaveBeenCalledWith(res);
    });
  });
});
