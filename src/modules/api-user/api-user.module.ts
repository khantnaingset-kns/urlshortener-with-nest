import { APIUser, APIUserSchema } from './schemas';
import { LoggerModule, LoggerService } from '@app/logger';

import { APIUserController } from './api-user.controller';
import { APIUserService } from './api-user.service';
import { Logger } from 'winston';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [LoggerModule],
        name: APIUser.name,
        useFactory: (loggerService: LoggerService) => {
          const schema = APIUserSchema;
          schema.post('save', () => {
            loggerService.verbose('New api-user created.');
          });
          return schema;
        },
        inject: [LoggerService],
      },
    ]),
  ],
  controllers: [APIUserController],
  providers: [APIUserService],
  exports: [APIUserService],
})
export class ApiUserModule {}
