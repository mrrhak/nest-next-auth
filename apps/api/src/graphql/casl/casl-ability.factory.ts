import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects
} from '@casl/ability';
import { E } from '@common';
import { JwtPayload } from '@lib/jwt/types';
import { Injectable } from '@nestjs/common';
import { Session, User } from '@schemas';

type Subjects = InferSubjects<User | typeof User | typeof Session> | 'all';

export type AppAbility = Ability<[E.ActionEnum, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(payload: JwtPayload) {
    console.log('casl jwt payload:', payload);
    const { can, build } = new AbilityBuilder<
      Ability<[E.ActionEnum, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (
      payload.roles?.includes(E.RoleEnum.SUPER_ADMIN) ||
      payload.roles?.includes(E.RoleEnum.ADMIN)
    ) {
      can(E.ActionEnum.MANAGE, 'all'); // read-write access to everything
    } else {
      // can(E.ActionEnum.READ, 'all'); // read-only access to everything

      //! User
      can(E.ActionEnum.READ, User, { email: 'mrrhak@gmail.com' });
      // can(E.ActionEnum.UPDATE, User, { id: payload.sub });

      //! Session
      // can(E.ActionEnum.READ, Session);
      // can(E.ActionEnum.DELETE, Session);
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => {
        // console.log('item constructor:', item.id);
        return item.constructor as ExtractSubjectType<Subjects>;
      }
    });
  }
}
