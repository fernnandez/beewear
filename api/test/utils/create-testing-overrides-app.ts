import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTestingAppOptions } from './create-testing-app';

interface CreateTestingAppWithOverridesOptions extends CreateTestingAppOptions {
  overrideProviders?: Array<{
    provide: any;
    useValue: any;
  }>;
}

export async function createTestingAppWithOverrides(
  options: CreateTestingAppWithOverridesOptions = {},
): Promise<INestApplication> {
  const moduleBuilder = Test.createTestingModule({
    imports: options.imports || [],
    providers: options.providers || [],
    controllers: options.controllers || [],
  });

  if (options.overrideProviders) {
    for (const override of options.overrideProviders) {
      moduleBuilder
        .overrideProvider(override.provide)
        .useValue(override.useValue);
    }
  }

  const moduleRef = await moduleBuilder.compile();

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
