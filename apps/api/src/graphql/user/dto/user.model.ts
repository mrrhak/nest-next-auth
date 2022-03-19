import { BaseModel, E, Paginated } from '@common';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel extends BaseModel {
  @Field(() => ID)
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field(() => [E.RoleEnum])
  roles!: E.RoleEnum[];

  @Field(() => E.StatusEnum)
  status!: E.StatusEnum;
}

@ObjectType()
export class PaginatedUserModel extends Paginated(UserModel) {}
