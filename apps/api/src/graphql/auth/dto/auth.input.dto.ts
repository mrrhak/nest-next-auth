import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class SignInInput {
  @Field()
  usernameOrEmail!: string;

  @Field()
  password!: string;
}
