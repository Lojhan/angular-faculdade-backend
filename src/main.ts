import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use('/api/images', express.static('./images'));
  await app.listen(4000);
})();
