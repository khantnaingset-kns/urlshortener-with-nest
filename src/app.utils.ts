import { ConfigService } from '@nestjs/config';

export function getMongoURI(configService: ConfigService): string {
  if (process.env.NODE_ENV === 'prod') {
    if (configService.get<boolean>('db.is_atlas')) {
      return `mongodb+srv://${configService.get<string>(
        'db.username',
      )}:${configService.get<string>(
        'db.password',
      )}@${configService.get<string>(
        'db.host',
      )}:${configService.get<number>}('db.port')`;
    }
    return `mongodb://${configService.get<string>(
      'db.username',
    )}:${configService.get<string>('db.password')}@${configService.get<string>(
      'db.host',
    )}:${configService.get<number>}('db.port')/${configService.get<string>(
      'db.atlas_prefix',
    )}`;
  } else {
    return configService.get<string>('db.uri');
  }
}
