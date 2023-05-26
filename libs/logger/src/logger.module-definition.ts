import { ConfigurableModuleBuilder } from '@nestjs/common';
import { LoggerModuleOption } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<LoggerModuleOption>().build();
