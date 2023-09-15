import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IBlacklistURL, IBlacklistURLList } from 'libs/core';

export class BlacklistURLDto implements IBlacklistURL {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class BlacklistURLResponse implements IBlacklistURL {
  @ApiProperty()
  readonly url: string;
}

export class BlacklistURLDeleteResponse {
  @ApiProperty()
  readonly message: string;
}

export class BlacklistURLListDto implements IBlacklistURLList {
  @ApiProperty({ type: BlacklistURLDto })
  urls: IBlacklistURL[];
}
