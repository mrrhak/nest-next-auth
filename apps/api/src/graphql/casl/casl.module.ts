import { Module } from '@nestjs/common';
// import { CaslAbilityFactory } from './casl-ability.factory';
// import { CaslModule as _CaslModule } from 'nest-casl';
// import { E } from '@common';

@Module({
  // imports: [
  //   _CaslModule.forRoot({
  //     // Role to grant full access, optional
  //     superuserRole: E.RoleEnum.SUPER_ADMIN,
  //     // Function to get casl user from request
  //     // Optional, defaults to `(request) => request.user`
  //     getUserFromRequest: (request) => request.user
  //   })
  // ]
  // providers: [CaslAbilityFactory],
  // exports: [CaslAbilityFactory]
})
export class CaslModule {}
