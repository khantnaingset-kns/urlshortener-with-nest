import * as validURL from 'valid-url';

import { BlackListURLService } from '../blacklist-url/blacklist-url.service';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ShortenURL, ShortenURLDocument } from './schemas';
import { InjectModel } from '@nestjs/mongoose';
import * as NanoID from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { Pagination, PartialTextSearchQuery } from 'src/core/interfaces';
import { OriginalURLPack, ShortenURLPack } from './interfaces';

@Injectable()
export class URLShortenerService {
  constructor(
    @InjectModel(ShortenURL.name)
    private readonly _urlShortenModel: Model<ShortenURLDocument>,
    private readonly _blackListURLService: BlackListURLService,
    private readonly _configService: ConfigService,
  ) {}

  /**
   * Strict URL to just to base URL
   * @param url
   * returns String
   */
  getBaseURL(url: string): string {
    const fragments = url.split('://');
    return fragments[0] + '://' + fragments[1].split('/')[0];
  }

  /**
   * Validate the URL with Blacklist URL and actual URL or not
   * @param url
   * @returns Promise<boolean>
   */
  async validateURL(url: string): Promise<boolean> {
    if (validURL.isUri(url)) {
      const isURLBlackList = await this._blackListURLService.findByURL(
        this.getBaseURL(url),
      );
      if (isURLBlackList != null) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * @description This is the version 1 URL Shortener function.
   * @description This one generated shorter url but expiration is not more than 9 days
   * @params longURL and Id of the url creator
   * @returns Shorten URL
   */
  async generateShortURLV1(
    longUrl: string,
    userId: string,
  ): Promise<ShortenURLPack> {
    const isValid = await this.validateURL(longUrl);
    if (isValid) {
      const alphabet = '123456789abcdefghijklmnopqrstuvwxyz';
      const nanoid = NanoID.customAlphabet(alphabet, 8);
      const shortenURL = new this._urlShortenModel({
        originalUrl: longUrl,
        urlCode: nanoid(),
        owner: userId,
        version: 'V1',
        expireDate: DateTime.now()
          .plus({
            // for the v1 url generator expiration can't be longer than 9
            days:
              this._configService.get<number>('app.urlExpirationDaysV1') > 9
                ? 9
                : this._configService.get<number>('app.urlExpirationDaysV1'),
          })
          .toJSDate()
          .toISOString(),
      });
      const result = await shortenURL.save();
      return {
        urlCode: result.urlCode,
        shortenURL: `${this._configService.get<string>('app.baseURL')}/${
          result.urlCode
        }`,
        expireDate: result.expireDate,
        version: result.version,
      };
    } else {
      return null;
    }
  }

  /**
   * @description This is the version 2 URL Shortener function.
   * @description This one generated longer url but expiration can last to 1000 years
   * @params longURL and Id of the url creator
   * @returns Shorten URL
   */
  async generateShortURLV2(
    longUrl: string,
    userId: string,
  ): Promise<ShortenURLPack> {
    const isValid = await this.validateURL(longUrl);
    if (isValid) {
      const alphabet =
        '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
      const nanoid = NanoID.customAlphabet(alphabet, 12);
      const shortenURL = new this._urlShortenModel({
        originalUrl: longUrl,
        urlCode: nanoid(),
        owner: userId,
        version: 'V2',
        expireDate: DateTime.now()
          .plus({
            // for the v2 url generator the expiration be longer than 1000 years
            days: this._configService.get<number>('app.urlExpirationDaysV2'),
          })
          .toJSDate()
          .toISOString(),
      });
      const result = await shortenURL.save();
      console.log(result);
      return {
        urlCode: result.urlCode,
        shortenURL: `${this._configService.get<string>('app.baseURL')}/${
          result.urlCode
        }`,
        expireDate: result.expireDate,
        version: result.version,
      };
    } else {
      return null;
    }
  }

  async findAll({ skip, take }: Pagination): Promise<ShortenURLDocument[]> {
    return this._urlShortenModel.find().skip(skip).limit(take).exec();
  }

  async findOne(originalURL: string): Promise<ShortenURLDocument> {
    return this._urlShortenModel.findOne({ originalUrl: originalURL }).exec();
  }

  async findByText({
    text,
    pagination,
  }: PartialTextSearchQuery): Promise<ShortenURLDocument[]> {
    return this._urlShortenModel
      .find({
        originalUrl: { $regex: text, $options: 'i' },
      })
      .skip(pagination.skip)
      .limit(pagination.take)
      .exec();
  }
  /**
   * Call once per redirect
   * @param urlCode
   * @returns Promise<OriginalURLPack>
   */
  async getLongURLByShortCode(urlCode: string): Promise<OriginalURLPack> {
    const result = await this._urlShortenModel.findOne({ urlCode }).exec();
    if (result === null) {
      return null;
    } else {
      await this._urlShortenModel
        .findOneAndUpdate(result._id, { $inc: { clicks: 1 } })
        .exec();
      return {
        originalURL: result.originalUrl,
        expireDate: result.expireDate,
      };
    }
  }

  async deleteShortenURLById(id: string): Promise<ShortenURLDocument> {
    return this._urlShortenModel.findByIdAndDelete(id).exec();
  }
}
