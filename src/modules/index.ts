import { ApiUserModule } from './api-user/api-user.module';
import { AuthModule } from './auth/auth.module';
import { BlackListURLModule } from './blacklist-url/blacklist-url.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ApiUserModule, AuthModule, BlackListURLModule],
})
export class ComposerModule {}
