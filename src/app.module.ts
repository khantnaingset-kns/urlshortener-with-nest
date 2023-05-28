import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ComposerModule } from './modules/';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { config } from './config';
import { getMongoURI } from './app.utils';

@Module({
  imports: [
    LoggerModule.registerForRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        logLevel: configService.get('app.logLevel'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: getMongoURI(configService),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [config],
    }),
    ComposerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
