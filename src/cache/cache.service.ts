import { CACHE_MANAGER, Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from '../authorization/interface/user.model';
import { Customer } from '../customer/entities/customer.interface';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheStore: Cache) {}

  async createCache(id: string, idToken) {
    return this.cacheStore.set<Customer>(id, idToken);
  }

  async getConsumerCache(id: string) {
    return await this.cacheStore.get<Customer>(id);
  }

  async delConsumerCache(id: string) {
    this.cacheStore.del(id);
  }

  async deleteAllCacheData() {
    this.cacheStore.reset();
  }

  async cacheUser(uuid: string, user: User) {
    this.cacheStore.set<User>(uuid, user);
  }
}
