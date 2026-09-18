import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  getClient(): Redis {
    if (!this.client) {
      const redisUrl = this.configService.get<string>(
        "REDIS_URL",
        "redis://localhost:6379",
      );
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.client.connect().catch((error: Error) => {
        this.logger.warn(`Redis connection failed: ${error.message}`);
      });
    }

    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async incrementWithExpiry(
    key: string,
    ttlSeconds: number,
  ): Promise<number> {
    const client = this.getClient();
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, ttlSeconds);
    }
    return count;
  }
}
