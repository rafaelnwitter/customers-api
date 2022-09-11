import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get(key) {
    return this.cache.get(key);
  }

  async set(key, value) {
    await this.cache.set(key, value);
  }
}
