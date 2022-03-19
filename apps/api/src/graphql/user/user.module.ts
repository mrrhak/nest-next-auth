import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { HashLibModule } from '@lib/hash';
import { CaslModule } from 'nest-casl';
import { userPermissions } from './user.permissions';

@Module({
  imports: [
    HashLibModule,
    CaslModule.forFeature({ permissions: userPermissions })
  ],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
