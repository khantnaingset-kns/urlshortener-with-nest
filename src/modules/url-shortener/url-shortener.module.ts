import { LoggerModule, LoggerService } from '@app/logger';
import { ShortenURL, ShortenURLSchema } from './schemas';

import { BlackListURLModule } from '../blacklist-url/blacklist-url.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { URLShortenerController } from './url-shortener.controller';
import { URLShortenerService } from './url-shortener.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [LoggerModule],
        name: ShortenURL.name,
        useFactory: (loggerService: LoggerService) => {
          const schema = ShortenURLSchema;
          schema.post('save', () => {
            loggerService.verbose('New blacklist url created.');
          });
          return schema;
        },
        inject: [LoggerService],
      },
    ]),
    BlackListURLModule,
  ],
  providers: [URLShortenerService],
  controllers: [URLShortenerController],
  exports: [URLShortenerService],
})
export class UrlShortenerModule {}
