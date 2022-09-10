import { Logger } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { ssl } from './ssl';

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
  const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(),
		{ httpsOptions: ssl(), bufferLogs: true },
	);
  app.use(cookieParser());
  app.use(csurf({ cookie: { sameSite: true } }));

  app.use((req: any, res: any, next: any) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;

    next();
  });
  app.listen(3000);
}
bootstrap();
