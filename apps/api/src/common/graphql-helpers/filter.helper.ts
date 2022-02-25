import { C, E } from '@common';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class BaseFilter {
  @Field(() => [E.StatusEnum], {
    nullable: true,
    defaultValue: [E.StatusEnum.ACTIVE, E.StatusEnum.INACTIVE],
  })
  readonly status!: Array<E.StatusEnum>;
  @Field(() => Int, { defaultValue: C.VARIABLE.defaultLimit, nullable: true })
  readonly limit!: number;
  @Field(() => Int, { defaultValue: C.VARIABLE.defaultPageNum, nullable: true })
  readonly page!: number;
}
