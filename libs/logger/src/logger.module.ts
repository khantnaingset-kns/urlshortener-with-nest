import { AppLogLevel, LoggerAsyncRegisterOptions } from './interface';
import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from './logger.service';

@Module({})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  static registerForRoot({ logLevel }: AppLogLevel): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOG_LEVEL',
          useValue: logLevel,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  static registerForRootAsync(
    options: LoggerAsyncRegisterOptions,
  ): DynamicModule {
    return {
      imports: options.imports,
      module: LoggerModule,
      providers: [
        {
          provide: 'LOG_LEVEL',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
