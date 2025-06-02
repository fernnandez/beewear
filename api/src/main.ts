import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // lança erro se enviar propriedades extras
      transform: true, // transforma payloads para os tipos corretos
      stopAtFirstError: true, //  para parar na primeira falha por campo
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
