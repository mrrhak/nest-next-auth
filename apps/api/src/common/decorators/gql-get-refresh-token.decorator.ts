import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlGetRefreshToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (req?.headers && req.headers[process.env.REFRESH_TOKEN_KEY]) {
      return req.headers[process.env.REFRESH_TOKEN_KEY];
    } else if (req?.cookies && req.cookies[process.env.REFRESH_TOKEN_KEY]) {
      return req.cookies[process.env.REFRESH_TOKEN_KEY];
    }
    return '';
  }
);
