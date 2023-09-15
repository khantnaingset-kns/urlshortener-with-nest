import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/logger';
import { NestFactory } from '@nestjs/core';
import helmet from '@fastify/helmet';

/**
 * Bootstrap the whole Nest application
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: process.env.NODE_ENV === 'prod' ? false : undefined,
    },
  );

  // inject custom logger based on NODE_ENV
  if (process.env.NODE_ENV === 'prod') {
    app.useLogger(app.get(LoggerService));
  }

  // enabling CORS
  app.enableCors();
  const configService = app.get(ConfigService);

  // enable URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // enable the validation pipe globally
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // register the fastiy helmet
  await app.register(helmet, { global: true });

  // setup global prefix
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '', method: RequestMethod.GET },
    ],
  });

  // setup OpenAPI - Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Url Shortener with Nest')
    .setDescription(
      'A simple and yet powerful URL Shortener API written in Nest.js',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false }),
  );

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
