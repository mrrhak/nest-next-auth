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
  COOKIES_ACCESS_TOKEN_NAME: string;

  @IsNotEmpty()
  COOKIES_REFRESH_TOKEN_NAME: string;

  @IsNotEmpty()
  COOKIES_ACCESS_TOKEN_EXPIRED: string;

  @IsNotEmpty()
  COOKIES_REFRESH_TOKEN_EXPIRED: string;

  @IsNotEmpty()
  THROTTLE_TTL: string;

  @IsNotEmpty()
  THROTTLE_LIMIT: string;
}
