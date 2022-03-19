import { InferSubjects } from '@casl/ability';
import { E } from '@common';
import { Permissions } from 'nest-casl';
import { Session, User } from '@schemas';

export type Subjects = InferSubjects<typeof User | typeof Session>;

export const userPermissions: Permissions<E.RoleEnum, Subjects, E.ActionEnum> =
  {
    // everyone({ can }) {
    //   can(Actions.read, UserModel);
    //   can(Actions.create, UserModel);
    // },

    //! Role
    user({ user, can }) {
      // Subject User
      can(E.ActionEnum.READ, User, { id: user['sub'] });
      can(E.ActionEnum.UPDATE, User, { id: user['sub'] });

      // Subject Session
      can(E.ActionEnum.READ, Session, { userId: user['sub'] });
      can(E.ActionEnum.DELETE, Session, { userId: user['sub'] });
    }
  };
