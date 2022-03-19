import { registerEnumType } from '@nestjs/graphql';

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user'
}

export enum ActionEnum {
  MANAGE = 'manage',
  AGGREGATE = 'aggregate',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

registerEnumType(StatusEnum, { name: 'StatusEnum' });
registerEnumType(RoleEnum, { name: 'RoleEnum' });
registerEnumType(ActionEnum, { name: 'ActionEnum' });
