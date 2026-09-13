import { Global, Module, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService) => {
        const logger = new Logger("RedisModule");
        const client = new Redis(config.getOrThrow<string>("redisUrl"), {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          retryStrategy(times) {
            return Math.min(times * 500, 5000);
          }
        });
        client.on("error", (err) => {
          logger.warn(`Redis connection error: ${err.message}`);
        });
        client.connect().catch((err) => {
          logger.warn(`Redis initial connection failed: ${err.message}`);
        });
        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports: [REDIS_CLIENT]
})
export class RedisModule {}
