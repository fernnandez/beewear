import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import * as mime from 'mime-types';
import { memoryStorage } from 'multer';
import { basename, extname, join } from 'path';
import { CloudinaryStorageInterface } from 'src/infra/storage/cloudinary/cloudinary.interface';
import { LocalStorageInterface } from 'src/infra/storage/local/local.interface';

const uploadsDir = join(process.cwd(), 'uploads/images');

@Controller('upload')
export class UploadController {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService:
      | CloudinaryStorageInterface
      | LocalStorageInterface,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async upload(@UploadedFile() file: Express.Multer.File) {
    // Gera nome baseado no nome original, sem extensão
    const baseName = basename(file.originalname, extname(file.originalname));
    const safeName = baseName.replace(/\s+/g, '_').toLowerCase();

    const imageUrl = await this.imageStorageService.upload(
      file.buffer,
      safeName,
    );

    return {
      url: imageUrl,
      filename: file.originalname,
    };
  }

  @Get(':filename')
  async serveImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = join(uploadsDir, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Imagem não encontrada');
    }

    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const stream = createReadStream(filePath);
    stream.pipe(res);
  }
}
