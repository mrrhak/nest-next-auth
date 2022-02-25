import { IsNotEmpty } from 'class-validator';

export class MongooseLibConfig {
  @IsNotEmpty()
  MONGO_DB_URI!: string;
}
