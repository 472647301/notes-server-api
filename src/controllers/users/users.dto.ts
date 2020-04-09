import { IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  readonly email: string;

  @IsString()
  readonly nickname: string;
}

export class UserDto {
  @IsString()
  readonly email: string;
  @IsString()
  readonly password: string;
  @IsString()
  readonly nickname: string;
  @IsString()
  readonly active_code: string;
}

export class UserLogin {
  @IsString()
  readonly email: string;
  @IsString()
  readonly password: string;
}
