import { CacheInterceptor, CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import redisStore from 'cache-manager-redis-store';
import { Customer } from 'src/customer/entities/customer.interface';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_URL'),
        ttl: configService.get<number>('redis.ttl', 100),
        db: 0,
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RedisCacheModule, CacheModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ],
})
export class RedisCacheModule {}
