import { E } from '@common';
import { AppAbility } from '@graphql/casl/casl-ability.factory';
import { SetMetadata } from '@nestjs/common';
import { User } from '@schemas';

interface IAbilityHandler {
  handle(ability: AppAbility): boolean;
}

type AbilityHandlerCallback = (ability: AppAbility) => boolean;

export type AbilityHandler = IAbilityHandler | AbilityHandlerCallback;

export const CHECK_ABILITIES_KEY = 'check_abilities';
export const CheckAbilities = (...handlers: AbilityHandler[]) =>
  SetMetadata(CHECK_ABILITIES_KEY, handlers);

export class ReadUserAbilityHandler implements IAbilityHandler {
  handle(ability: AppAbility) {
    return ability.can(E.ActionEnum.READ, User);
  }
}
