import { Global, Module } from '@nestjs/common';
import { HashLibService } from './hash.lib.service';

@Global()
@Module({
  providers: [HashLibService],
  exports: [HashLibService]
})
export class HashLibModule {}
