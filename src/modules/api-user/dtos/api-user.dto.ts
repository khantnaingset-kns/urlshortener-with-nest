import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { Role } from '../enums';

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

export class APIUserResponse extends PartialType(CreateAPIUserDTO) {
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
