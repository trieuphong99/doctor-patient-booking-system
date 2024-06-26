import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './apps/helpers/error-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(80);
}
bootstrap();
