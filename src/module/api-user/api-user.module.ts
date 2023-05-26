import { APIUser, APIUserSchema } from './schema';
import { LoggerModule, LoggerService } from '@app/logger';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    LoggerModule,
    MongooseModule.forFeatureAsync([
      {
        name: APIUser.name,
        imports: [LoggerModule],
        useFactory: (loggerService: LoggerService) => {
          const schema = APIUserSchema;
          schema.post('save', () => {
            loggerService.verbose('New api-user created.');
          });
        },
        inject: [LoggerService],
      },
    ]),
  ],
})
export class ApiUserModule {}
