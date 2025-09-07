import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../auth/decorator/public.decorator';
import * as path from 'path';
import * as fs from 'fs';

@Controller('uploads/images')
@Public()
export class ImageServeController {
  @Get(':filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      // Caminho para a pasta de imagens de teste
      const imagePath = path.join(process.cwd(), 'test/utils/files', filename);
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(imagePath)) {
        throw new NotFoundException(`Imagem não encontrada: ${filename}`);
      }

      // Determinar o tipo de conteúdo baseado na extensão
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'image/jpeg'; // padrão

      switch (ext) {
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
      }

      // Configurar headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 ano
      
      // Enviar o arquivo
      res.sendFile(imagePath);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Erro ao carregar imagem: ${filename}`);
    }
  }
}

