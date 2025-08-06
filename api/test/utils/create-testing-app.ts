import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export interface CreateTestingAppOptions {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  globalPipes?: boolean;
  enableLogs?: boolean;
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

  // Habilitar logs detalhados durante os testes
  if (options.enableLogs !== false) {
    const logger = new Logger('TestApp');

    // Log de todas as requisições
    app.use((req, res, next) => {
      logger.log(
        `[${req.method}] ${req.url} - Body: ${JSON.stringify(req.body)}`,
      );
      next();
    });

    // Log de erros
    app.use((err, req, res, next) => {
      logger.error(
        `Error in ${req.method} ${req.url}: ${err.message}`,
        err.stack,
      );
      next(err);
    });

    // Habilitar logs do NestJS
    app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
  }

  if (options.globalPipes !== false) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
  }

  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
  await app.init();
  return app;
}
