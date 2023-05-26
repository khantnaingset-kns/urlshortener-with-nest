import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiUserModule } from './module/api-user/api-user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';
import { config } from './config';

@Module({
  imports: [
    LoggerModule.registerForRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        logLevel: configService.get('app.logLevel'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [config],
    }),
    ApiUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
