import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { IResTokens } from '../interfaces/auth.service.interfaces';

export class SignupBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  confirmPassword: string;

  @IsString()
  lineUID: string;
}

export class SigninBodyDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  password: string;
}

export class RefreshTokenReqDto {
  @IsString()
  @Expose({ name: 'line_uid' })
  lineUID: string;

  @IsString()
  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}

export class ResTokens {
  constructor(tokens: IResTokens) {
    this.access_token = tokens.accessToken;
    this.refresh_token = tokens.refreshToken;
  }

  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;
}
