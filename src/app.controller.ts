import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { AppService } from './app.service';
import { URLShortenerService } from './modules/url-shortener/url-shortener.service';
import { DateTime } from 'luxon';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(
    private readonly _appService: AppService,
    private readonly _urlShortenerService: URLShortenerService,
  ) {}

  @Get(':urlcode')
  async redirectToOriginalURL(@Param() urlCode: string, @Res() res: any) {
    const result = await this._urlShortenerService.getLongURLByShortCode(
      urlCode,
    );
    if (result === null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid URL',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: new Error('Invalid URL'),
        },
      );
    } else {
      const now = DateTime.now().toJSDate().toISOString();
      if (DateTime.fromISO(now) > DateTime.fromISO(result.expireDate)) {
        throw new HttpException(
          {
            status: HttpStatus.GONE,
            error: 'URL Expired',
          },
          HttpStatus.FORBIDDEN,
          {
            cause: new Error('URL Expired'),
          },
        );
      } else {
        res.status(302).redirect(result.originalURL);
      }
    }
  }
}
