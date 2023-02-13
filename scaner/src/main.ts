import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { AggTrade } from './aggTrades/model';

async function bootstrap() {
  let app;
  let mode;
  if (process.env.USE_FASTIFY === 'true') {
    mode = 'fastify';
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
  } else {
    mode = 'express';
    app = await NestFactory.create(AppModule);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin: true});

  await app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`App is running at ${process.env.PORT} port. App mode ${mode}`);
  });
}




bootstrap();

