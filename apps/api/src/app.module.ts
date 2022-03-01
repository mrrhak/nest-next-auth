import { ConfigLibModule } from '@lib/config';
import { GraphQLLibModule } from '@lib/graphql';
import { MongooseLibModule } from '@lib/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from './graphql/graphql.module';
import { ThrottlerLibModule } from './lib/throttler/throttler.lib.module';

@Module({
  imports: [
    ConfigLibModule,
    MongooseLibModule,
    GraphQLLibModule,
    GraphQLModule,
    ThrottlerLibModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
