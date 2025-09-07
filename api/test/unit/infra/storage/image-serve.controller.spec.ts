import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ImageServeController } from 'src/infra/storage/image-serve.controller';

// Mock do fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

// Mock do path
jest.mock('path', () => ({
  join: jest.fn(),
  extname: jest.fn(),
}));

describe('ImageServeController', () => {
  let controller: ImageServeController;
  let mockResponse: Partial<Response>;
  let fs: any;
  let path: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageServeController],
    }).compile();

    controller = module.get<ImageServeController>(ImageServeController);

    // Mock do response
    mockResponse = {
      setHeader: jest.fn(),
      sendFile: jest.fn(),
    };

    // Obter referências aos mocks
    fs = jest.requireMock('fs');
    path = jest.requireMock('path');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('serveImage', () => {
    it('deve servir imagem PNG com Content-Type correto', async () => {
      const filename = 'test-image.png';
      const imagePath = '/path/to/test-image.png';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.png');

      await controller.serveImage(filename, mockResponse as Response);

      expect(fs.existsSync).toHaveBeenCalledWith(imagePath);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/png',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=31536000',
      );
      expect(mockResponse.sendFile).toHaveBeenCalledWith(imagePath);
    });

    it('deve servir imagem JPEG com Content-Type correto', async () => {
      const filename = 'test-image.jpg';
      const imagePath = '/path/to/test-image.jpg';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.jpg');

      await controller.serveImage(filename, mockResponse as Response);

      expect(fs.existsSync).toHaveBeenCalledWith(imagePath);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/jpeg',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=31536000',
      );
      expect(mockResponse.sendFile).toHaveBeenCalledWith(imagePath);
    });

    it('deve servir imagem JPEG com extensão .jpeg', async () => {
      const filename = 'test-image.jpeg';
      const imagePath = '/path/to/test-image.jpeg';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.jpeg');

      await controller.serveImage(filename, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/jpeg',
      );
    });

    it('deve servir imagem GIF com Content-Type correto', async () => {
      const filename = 'test-image.gif';
      const imagePath = '/path/to/test-image.gif';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.gif');

      await controller.serveImage(filename, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/gif',
      );
    });

    it('deve servir imagem WebP com Content-Type correto', async () => {
      const filename = 'test-image.webp';
      const imagePath = '/path/to/test-image.webp';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.webp');

      await controller.serveImage(filename, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/webp',
      );
    });

    it('deve usar Content-Type padrão para extensões desconhecidas', async () => {
      const filename = 'test-image.unknown';
      const imagePath = '/path/to/test-image.unknown';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.unknown');

      await controller.serveImage(filename, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/jpeg',
      );
    });

    it('deve configurar Cache-Control para 1 ano', async () => {
      const filename = 'test-image.png';
      const imagePath = '/path/to/test-image.png';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.png');

      await controller.serveImage(filename, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=31536000',
      );
    });

    it('deve lançar NotFoundException se o arquivo não existir', async () => {
      const filename = 'non-existent-image.png';
      const imagePath = '/path/to/non-existent-image.png';

      fs.existsSync.mockReturnValue(false);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.png');

      await expect(
        controller.serveImage(filename, mockResponse as Response),
      ).rejects.toThrow(NotFoundException);

      expect(mockResponse.setHeader).not.toHaveBeenCalled();
      expect(mockResponse.sendFile).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException com mensagem específica se o arquivo não existir', async () => {
      const filename = 'non-existent-image.png';
      const imagePath = '/path/to/non-existent-image.png';

      fs.existsSync.mockReturnValue(false);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.png');

      await expect(
        controller.serveImage(filename, mockResponse as Response),
      ).rejects.toThrow(`Imagem não encontrada: ${filename}`);
    });

    it('deve lançar NotFoundException genérica se ocorrer erro inesperado', async () => {
      const filename = 'test-image.png';
      const imagePath = '/path/to/test-image.png';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(imagePath);
      path.extname.mockReturnValue('.png');

      // Simular erro no sendFile
      mockResponse.sendFile = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(
        controller.serveImage(filename, mockResponse as Response),
      ).rejects.toThrow(`Erro ao carregar imagem: ${filename}`);
    });

    it('deve construir o caminho correto para a imagem', async () => {
      const filename = 'test-image.png';
      const expectedPath = '/expected/path/to/test-image.png';

      fs.existsSync.mockReturnValue(true);
      path.join.mockReturnValue(expectedPath);
      path.extname.mockReturnValue('.png');

      await controller.serveImage(filename, mockResponse as Response);

      expect(path.join).toHaveBeenCalledWith(
        process.cwd(),
        'test/utils/files',
        filename,
      );
    });
  });
});
