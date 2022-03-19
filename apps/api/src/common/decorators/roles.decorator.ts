import { E } from '@common';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: E.RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
