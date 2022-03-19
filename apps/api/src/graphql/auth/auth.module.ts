import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '@graphql/user/user.module';
import { JwtLibModule } from '@lib/jwt';
import { HashLibModule } from '@lib/hash';
import { AtStrategy, RtStrategy } from './strategies';
import { SessionModule } from '@graphql/session/session.module';

@Module({
  imports: [UserModule, JwtLibModule, HashLibModule, SessionModule],
  providers: [AuthService, AuthResolver, AtStrategy, RtStrategy]
})
export class AuthModule {}
