import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { Role } from '../enum';

export class CreateAPIUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Role)
  role: string;
}

export class UpdateAPIUserDTO extends PartialType(CreateAPIUserDTO) {}

export class DeleteAPIUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userID: string;
}
