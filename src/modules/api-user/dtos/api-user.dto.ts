import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { EUserRole, IUser } from 'libs/core';

export class APIUserDto implements IUser {
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
  @IsEnum(EUserRole)
  role: EUserRole;
}

export class CreateAPIUserDto extends APIUserDto {}

export class UpdateAPIUserDTO extends PartialType(CreateAPIUserDto) {}

export class APIUserResponse extends PartialType(CreateAPIUserDto) {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class DeleteRouteSuccessResponse {
  @ApiProperty()
  message: string;
}
