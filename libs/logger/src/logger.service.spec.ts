import { Test, TestingModule } from '@nestjs/testing';

import { LogLevel } from './enum';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;
  const logLevel = LogLevel.debug;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: 'LOG_LEVEL',
          useValue: logLevel,
        },
      ],
    }).compile();

    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  it('should return correct loglevel', () => {
    expect(loggerService.getLogLevel()).toEqual(logLevel);
  });

  it('should call verbose method on the logger', () => {
    const logMessage = 'This is a verbose log message';
    const spy = jest.spyOn(loggerService, 'verbose');

    loggerService.verbose(logMessage);

    expect(spy).toHaveBeenCalledWith(logMessage);
  });

  it('should call silly method on the logger', () => {
    const logMessage = 'This is a silly log message';
    const spy = jest.spyOn(loggerService, 'silly');

    loggerService.silly(logMessage);

    expect(spy).toHaveBeenCalledWith(logMessage);
  });

  it('should call http method on the logger', () => {
    const logMessage = 'This is an HTTP log message';
    const spy = jest.spyOn(loggerService, 'http');

    loggerService.http(logMessage);

    expect(spy).toHaveBeenCalledWith(logMessage);
  });

  it('should call info method on the logger', () => {
    const logMessage = 'This is an info log message';
    const spy = jest.spyOn(loggerService, 'info');

    loggerService.info(logMessage);

    expect(spy).toHaveBeenCalledWith(logMessage);
  });

  it('should call error method on the logger', () => {
    const logMessage = 'This is an error log message';
    const spy = jest.spyOn(loggerService, 'error');

    loggerService.error(logMessage);

    expect(spy).toHaveBeenCalledWith(logMessage);
  });

  it('should call warn method on the logger', () => {
    const logMessage = 'This is a warning log message';
    const spy = jest.spyOn(loggerService, 'warn');

    loggerService.warn(logMessage);

    expect(spy).toHaveBeenCalledWith(logMessage);
  });
});
