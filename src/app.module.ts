import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, LoggerService } from '@app/logger';

import { ApiUserModule } from './module/api-user/api-user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComposerModule } from './module/module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { getMongoURI } from './app.utils';

@Module({
  imports: [
    LoggerModule.registerForRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        logLevel: configService.get('app.logLevel'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: getMongoURI(configService),
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
