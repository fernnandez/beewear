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
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImageStorageService } from 'src/infra/storage/image-storage.service';
import { v4 as uuidv4 } from 'uuid';

const uploadsDir = join(process.cwd(), 'uploads/images');

@Controller('upload')
export class UploadController {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadsDir,
        filename: (_, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
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
    return this.imageStorageService.upload(file);
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
