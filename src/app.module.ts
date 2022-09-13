import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import CustomerModule from './customer/customer.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthenticationModule } from './authorization/authorization.module';
import { RedisCacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRY: Joi.string().required(),
        JWT_REFRESH_EXPIRY: Joi.string().required(),
        ENC_IV: Joi.string().required(),
        ENC_KEY: Joi.string().required(),
        API_DOMAIN: Joi.string().required(),
        API_ROUTE: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        CLIENT_SECRET: Joi.string().required(),
      }),
      cache: true,
      isGlobal: true,
    }),
    CustomerModule,
    AuthenticationModule,
    RedisCacheModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
