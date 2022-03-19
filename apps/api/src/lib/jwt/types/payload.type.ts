import { E } from '@common';

export type JwtPayload = {
  sub: string;
  roles: E.RoleEnum[];
};
