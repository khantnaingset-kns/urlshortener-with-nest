import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBlackListURLDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly url: string;
}

export class BlackListURLResponse {
  @ApiProperty()
  readonly url: string;
}

export class BlackListURLDeleteResponse {
  @ApiProperty()
  readonly message: string;
}
