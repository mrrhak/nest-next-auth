import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionModel {
  @Field()
  id!: string;

  @Field(() => Date)
  expiredAt!: Date;
}
