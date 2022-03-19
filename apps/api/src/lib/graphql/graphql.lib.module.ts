import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { GraphQLError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cors: {
        credentials: true,
        origin: ['http://localhost:3001']
      },
      plugins: [ApolloServerPluginInlineTraceDisabled()],
      autoSchemaFile: 'schema.gql',
      introspection: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql'
        }
      },
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      formatError: (error: GraphQLError) => {
        const ext = error.extensions as any;
        if (
          ext?.response &&
          ext.response.message &&
          Array.isArray(ext.response.message)
        ) {
          ext.response.message = ext.response.message[0];
        }

        if (ext.response?.message) {
          return {
            message: ext.response.message,
            locations: error.locations,
            path: error.path,
            extensions: ext
          };
        }
        return error;
      },
      context: ({ req, res }) => ({ req, res })
    })
  ]
})
export class GraphQLLibModule {}
