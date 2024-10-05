import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import globallConfig from './configs/global.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(globallConfig.server.port);
}
bootstrap();
