import { CacheInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { ssl } from './ssl';
import * as fs from 'fs';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';

// New logger instance
const logger = new Logger('Main');

// New microservice options object
const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    url: 'redis://localhost:6379',
  },
};

async function bootstrap() {
  const privateKey = fs.readFileSync('src/resources/ssl/private.key', 'utf8');
  const certificate = fs.readFileSync(
    'src/resources/ssl/certificate.pem',
    'utf8',
  );
  const httpsOptions = { key: privateKey, cert: certificate };

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(csurf({ cookie: { sameSite: true } }));

  app.use(cors());
  app.use(bodyParser.json());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
