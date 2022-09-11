import { Logger, ValidationPipe } from '@nestjs/common';
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
  // app.use(
  //   session({
  //     secret: 'keyboard cat',
  //     resave: false,
  //     saveUninitialized: true,
  //     cookie: { secure: true },
  //   }),
  // );
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(csurf({ cookie: { sameSite: true } }));

  app.use((req: any, res: any, next: any) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    // req.locals.csrfToken = token;
    // console.log(req.header);
    req.header('Set-Cookie');
    next();
  });
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
