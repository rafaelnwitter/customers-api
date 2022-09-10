import { CacheInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';
import { CustomerModule } from './customer/customer.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthorizationModule } from './authorization/authorization.module';
import { NestCacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';

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
        SHOULD_DEBUG_SQL: Joi.boolean(),
      }),
      cache: true,
      isGlobal: true,
    }),
    HealthModule,
    CustomerModule,
    AuthorizationModule,
    NestCacheModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
