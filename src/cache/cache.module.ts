import {
  CacheModule,
  CACHE_MANAGER,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 360 * 100 * 10,
        db: 0,
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RedisCacheModule, CacheService],
  providers: [
    // {
    // provide: APP_INTERCEPTOR,
    // useClass: CacheInterceptor,
    // },
    CacheService,
  ],
})
export class RedisCacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  public onModuleInit() {
    const logger = new Logger('Cache');
  }
}
