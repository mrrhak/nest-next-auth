import { Global, Module } from '@nestjs/common';
import { ConfigLibService } from './config.lib.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    })
  ],
  providers: [ConfigLibService],
  exports: [ConfigLibService]
})
export class ConfigLibModule {}
