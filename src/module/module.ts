import { Module } from '@nestjs/common';
import { ApiUserModule } from './api-user/api-user.module';

@Module({
  imports: [ApiUserModule],
})
export class ComposerModule {}
