import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSessionInput {
  @Field(() => ID)
  userId!: string;

  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field(() => Date)
  expiredAt!: Date;
}
