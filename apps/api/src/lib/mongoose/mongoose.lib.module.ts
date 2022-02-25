import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as schemas from '@schemas';

import { MongooseLibService } from './mongoose.lib.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongooseLibService }),
    MongooseModule.forFeature([
      ...(Object.keys(schemas)
        .filter((v) => !v.includes('Schema'))
        .map((ele) => ({
          name: schemas[ele].name,
          schema: schemas[`${ele}Schema`],
        })) as { name: string; schema: any }[]),
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseLibModule {}
