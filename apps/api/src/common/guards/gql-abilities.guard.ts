import {
  AppAbility,
  CaslAbilityFactory
} from '@graphql/casl/casl-ability.factory';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  CHECK_ABILITIES_KEY,
  AbilityHandler
} from '../decorators/check-abilities.decorator';

@Injectable()
export class GqlAbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const abilityHandlers =
      this.reflector.get<AbilityHandler[]>(
        CHECK_ABILITIES_KEY,
        context.getHandler()
      ) || [];

    const { user } = this.getRequest(context);
    const ability = this.caslAbilityFactory.createForUser(user);
    return abilityHandlers.every((handler) =>
      this.execAbilityHandler(handler, ability)
    );
  }

  private execAbilityHandler(handler: AbilityHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}

/**
 * @UseGuards(AbilitiesGuard)
 * @CheckAbilities((ability: AppAbility) => ability.can(Action.Read, Article))
 */

/**
  export class ReadArticleAbilityHandler implements IAbilityHandler {
    handle(ability: AppAbility) {
      return ability.can(Action.Read, Article);
    }
  }

  @CheckAbilities(new ReadArticleAbilityHandler())
 */
