import { ApiUserModule } from './api-user/api-user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ApiUserModule, AuthModule],
})
export class ComposerModule {}
