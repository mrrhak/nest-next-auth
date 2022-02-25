import { BaseFilter } from '@common';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterUserInput extends BaseFilter {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;
}

@InputType()
export class CreateUserInput {
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
