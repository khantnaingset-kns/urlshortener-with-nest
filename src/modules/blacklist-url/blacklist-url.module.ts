import { BlackListURL, BlackListURLSchema } from './schemas';
import { LoggerModule, LoggerService } from '@app/logger';

import { BlackListURLController } from './blacklist-url.controller';
import { BlackListURLService } from './blacklist-url.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [LoggerModule],
        name: BlackListURL.name,
        useFactory: (loggerService: LoggerService) => {
          const schema = BlackListURLSchema;
          schema.post('save', () => {
            loggerService.verbose('New blacklist url created.');
          });
          return schema;
        },
        inject: [LoggerService],
      },
    ]),
  ],
  providers: [BlackListURLService],
  controllers: [BlackListURLController],
})
export class BlackListURLModule {}
