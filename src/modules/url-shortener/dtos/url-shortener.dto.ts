import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ShortenURLRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly longUrl: string;
}

export class ShortenURLSingleResponse {
  @ApiProperty()
  readonly url: string;
  @ApiProperty()
  readonly expireDate: string;
}

export class ShortenURLMultipleResponse {
  @ApiProperty()
  readonly originalURL: string;

  @ApiProperty()
  readonly urlCode: string;

  @ApiProperty()
  readonly owner: string;

  @ApiProperty()
  readonly expireDate: string;

  @ApiProperty()
  readonly clicks: number;
}
