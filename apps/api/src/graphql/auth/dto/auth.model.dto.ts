import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthModel {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}
