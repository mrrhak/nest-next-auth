import { ConfigLibModule, ConfigLibService } from '@lib/config';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigLibModule],
      inject: [ConfigLibService],
      useFactory: (config: ConfigLibService) => {
        //https://github.com/kkoomen/nestjs-throttler-storage-redis
        return {
          ttl: Number(config.env.THROTTLE_TTL),
          limit: Number(config.env.THROTTLE_LIMIT),
          ignoreUserAgents: [
            // Don't throttle request that have 'googlebot' defined in them.
            // Example user agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
            /googlebot/gi,

            // Don't throttle request that have 'bingbot' defined in them.
            // Example user agent: Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
            new RegExp('bingbot', 'gi')
          ]
        };
      }
    })
  ]
})
export class ThrottlerLibModule {}
