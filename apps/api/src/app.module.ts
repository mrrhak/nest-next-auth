import { ConfigLibModule } from '@lib/config';
import { GraphQLLibModule } from '@lib/graphql';
import { MongooseLibModule } from '@lib/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    ConfigLibModule,
    MongooseLibModule,
    GraphQLLibModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
