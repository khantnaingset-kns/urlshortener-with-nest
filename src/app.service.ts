import { Injectable } from '@nestjs/common';
import { LoggerService } from '@app/logger';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
