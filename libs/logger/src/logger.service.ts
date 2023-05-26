import { Inject, Injectable } from '@nestjs/common';
import { Logger } from './interface';
import * as winston from 'winston';
import { LogLevel } from './enum';

@Injectable()
export class LoggerService implements Logger {
  private logger: winston.Logger;

  private _checkIncomingValueType(logLevel: any): boolean {
    return typeof logLevel == 'object' ? true : false;
  }
  constructor(@Inject('LOG_LEVEL') private readonly _logLevel) {
    if (this._checkIncomingValueType(this._logLevel)) {
      this._logLevel = this._logLevel.logLevel;
    }
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      level: this._logLevel,
      transports: [new winston.transports.Console()],
    });
  }

  getLogLevel(): LogLevel {
    return this._logLevel;
  }

  verbose(log: string): void {
    this.logger.verbose(log);
  }
  silly(log: string): void {
    this.logger.silly(log);
  }

  http(log: string): void {
    this.logger.http(log);
  }
  info(log: string): void {
    this.logger.info(log);
  }
  error(log: string): void {
    this.logger.error(log);
  }
  warn(log: string): void {
    this.logger.warn(log);
  }
}
