import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ConfigDto {
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsNotEmpty()
  @Transform((x) => +x)
  PORT!: number;

  @IsNotEmpty()
  JWT_AT_SECRET: string;

  @IsNotEmpty()
  JWT_RT_SECRET: string;

  @IsNotEmpty()
  JWT_AT_EXPIRE: string;

  @IsNotEmpty()
  JWT_RT_EXPIRE: string;

  @IsNotEmpty()
  ACCESS_TOKEN_KEY: string;

  @IsNotEmpty()
  REFRESH_TOKEN_KEY: string;

  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRED: string;

  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRED: string;

  @IsNotEmpty()
  THROTTLE_TTL: string;

  @IsNotEmpty()
  THROTTLE_LIMIT: string;
}
