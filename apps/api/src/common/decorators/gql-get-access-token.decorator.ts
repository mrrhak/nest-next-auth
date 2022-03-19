import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlGetAccessToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (
      req?.headers &&
      (req.headers['authorization'] || req.headers['Authorization'])
    ) {
      return (
        req.headers['authorization'] || req.headers['Authorization']
      ).replace('Bearer ', '');
    } else if (req?.cookies && req.cookies[process.env.ACCESS_TOKEN_KEY]) {
      return req.cookies[process.env.ACCESS_TOKEN_KEY].replace('Bearer ', '');
    }
    return '';
  }
);
