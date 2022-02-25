import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { HashLibModule } from '@lib/hash';

@Module({
  providers: [UserService, UserResolver, HashLibModule],
  exports: [UserService]
})
export class UserModule {}
