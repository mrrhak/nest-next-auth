import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtLibService } from './jwt.lib.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [JwtLibService],
  exports: [JwtLibService]
})
export class JwtLibModule {}
