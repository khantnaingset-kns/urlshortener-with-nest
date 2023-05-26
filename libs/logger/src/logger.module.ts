import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { LoggerModuleAsyncOption, LoggerModuleOption } from './interfaces';

import { ConfigurableModuleClass } from './logger.module-definition';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  static registerForRoot({ logLevel }: LoggerModuleOption): DynamicModule {
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

  static registerForRootAsync(options: LoggerModuleAsyncOption): DynamicModule {
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
