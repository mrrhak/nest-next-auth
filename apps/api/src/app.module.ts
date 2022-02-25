import { ConfigModule } from '@lib/config';
import { MongooseModule } from '@lib/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, MongooseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
