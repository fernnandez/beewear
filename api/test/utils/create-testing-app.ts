// test/utils/create-testing-app.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Type } from '@nestjs/common/interfaces';

interface CreateTestingAppOptions {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  globalPipes?: boolean;
}

export async function createTestingApp(
  options: CreateTestingAppOptions = {},
): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: options.imports || [],
    providers: options.providers || [],
    controllers: options.controllers || [],
  }).compile();

  const app = moduleRef.createNestApplication();

  if (options.globalPipes !== false) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
  }

  await app.init();
  return app;
}
