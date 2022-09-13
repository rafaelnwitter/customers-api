import { Logger, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import * as fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// New logger instance
const logger = new Logger('Main');

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
    origin: `http://localhost:3000`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // app.use(csurf({ cookie: { sameSite: true } }));
  app.use((req: any, res: any, next: any) => {
    const token = req.csrfToken;
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    next();
  });
  app.use(cors());
  app.use(bodyParser.json());

  app.listen(3000, () => console.log('Application is running on port 3000'));
}
bootstrap();
