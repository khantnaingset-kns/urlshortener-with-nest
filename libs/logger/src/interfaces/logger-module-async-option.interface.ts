import { LoggerModuleOption } from './logger-module-option.interface';
import { ModuleMetadata } from '@nestjs/common';

export interface LoggerModuleAsyncOption
  extends Pick<ModuleMetadata, 'imports'> {
  inject: any[];
  useFactory?: (...args: any[]) => Promise<LoggerModuleOption>;
}
