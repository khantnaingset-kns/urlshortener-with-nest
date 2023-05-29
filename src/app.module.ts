import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiUserModule } from './modules/api-user/api-user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlackListURLModule } from './modules/blacklist-url/blacklist-url.module';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlShortenerModule } from './modules/url-shortener/url-shortener.module';
import { config } from './config';
import { getMongoURI } from './app.utils';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
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
    UrlShortenerModule,
    ApiUserModule,
    BlackListURLModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
