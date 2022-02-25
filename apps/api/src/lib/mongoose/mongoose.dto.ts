import { IsNotEmpty } from 'class-validator';

export class MongooseConfig {
  @IsNotEmpty()
  MONGO_DB_URI!: string;
}
