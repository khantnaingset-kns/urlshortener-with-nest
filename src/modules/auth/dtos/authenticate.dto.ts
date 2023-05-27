import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
