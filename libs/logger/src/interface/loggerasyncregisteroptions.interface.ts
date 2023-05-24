import { AppLogLevel } from './apploglevel.interface';
import { ModuleMetadata } from '@nestjs/common';

export interface LoggerAsyncRegisterOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject: any[];
  useFactory?: (...args: any[]) => Promise<AppLogLevel>;
}
