import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsNotEmpty()
  firstName!: string;

  @Field()
  @IsNotEmpty()
  lastName!: string;

  @Field()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsNotEmpty()
  email!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}

@InputType()
export class SignInInput {
  @Field()
  usernameOrEmail!: string;

  @Field()
  password!: string;
}
