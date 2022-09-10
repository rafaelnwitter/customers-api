import { CacheModule, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import redisStore from "cache-manager-redis-store";
import { CacheService } from "./cache.service";

@Global()
@Module({
	imports: [
		CacheModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				store: redisStore,
				url: configService.get("redis.uri"),
				ttl: configService.get<number>("redis.ttl", 10),
				db: 0,
			}),
			inject: [ConfigService],
		}),
	],
	exports: [CacheModule, CacheService],
	providers: [CacheService],
})
export class NestCacheModule {}
