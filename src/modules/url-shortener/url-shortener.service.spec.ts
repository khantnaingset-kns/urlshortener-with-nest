import { Connection, Model, connect } from 'mongoose';
import { ShortenURL, ShortenURLDocument, ShortenURLSchema } from './schemas';
import { Test, TestingModule } from '@nestjs/testing';

import { BlackListURL } from '../blacklist-url/schemas';
import { BlackListURLService } from '../blacklist-url/blacklist-url.service';
import { ConfigModule } from '@nestjs/config';
import { DateTime } from 'luxon';
import { LoggerModule } from '@app/logger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { URLShortenerService } from './url-shortener.service';
import { config } from '../../config';
import { faker } from '@faker-js/faker';
import { getModelToken } from '@nestjs/mongoose';

describe('BlackListURLService', () => {
  let service: URLShortenerService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let model: Model<ShortenURLDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    model = mongoConnection.model<ShortenURLDocument>(
      ShortenURL.name,
      ShortenURLSchema,
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.registerForRoot({ logLevel: 'verbose' }),
        ConfigModule.forRoot({
          load: [config],
        }),
      ],
      providers: [
        URLShortenerService,
        {
          provide: getModelToken(ShortenURL.name),
          useValue: model,
        },
        {
          provide: BlackListURLService,
          useValue: {
            findByURL: jest.fn().mockImplementation((url) => {
              if (url === 'https://1337x.to') {
                return {
                  url,
                } as BlackListURL;
              } else {
                null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<URLShortenerService>(URLShortenerService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get Base URL', () => {
    it('should return correct base url', () => {
      const baseURL = 'https://subsplease.org';
      const url =
        'https://subsplease.org/shows/kimetsu-no-yaiba-katanakaji-no-sato-hen/';
      expect(service.getBaseURL(url)).toEqual(baseURL);
    });
  });

  describe('Validate the URL', () => {
    it('URL should be valid', async () => {
      const url = 'https://subsplease.org';
      const isValid = await service.validateURL(url);
      expect(isValid).toBeTruthy();
    });

    it('URL should be invalid', async () => {
      const url = 'https://1337x.to';
      const isValid = await service.validateURL(url);
      expect(isValid).toBeFalsy();
    });
  });

  describe('Generate a shortened URL', () => {
    it('v1: should return shorten url, and incresement is working', async () => {
      const url = 'https://subsplease.org';
      const shortenURL = await service.generateShortURLV1(
        url,
        '6472c930462e8056f1bc73a9',
      );
      expect(shortenURL.shortenURL).toBeDefined();
      expect(shortenURL.version).toBe('V1');
      const unIncreseValue = await service.findOne(url);
      expect(unIncreseValue.clicks).toBe(0);
      const result = await service.getLongURLByShortCode(shortenURL.urlCode);

      const increseValue = await service.findOne(url);
      expect(increseValue.clicks).toBe(1);

      expect(result.originalURL).toEqual(url);

      for (let i = 0; i <= 10; i++) {
        await service.getLongURLByShortCode(shortenURL.urlCode);
      }

      const increseValue_two = await service.findOne(url);
      expect(increseValue_two.clicks).toBe(12);
    });

    it('v2: should return shorten url, and incresement is working', async () => {
      const url = 'https://www.google.com';
      const shortenURL = await service.generateShortURLV2(
        url,
        '6472c930462e8056f1bc73a9',
      );
      expect(shortenURL.shortenURL).toBeDefined();
      expect(shortenURL.version).toBe('V2');
      const unIncreseValue = await service.findOne(url);
      expect(unIncreseValue.clicks).toBe(0);
      const result = await service.getLongURLByShortCode(shortenURL.urlCode);

      const increseValue_one = await service.findOne(url);
      expect(increseValue_one.clicks).toBe(1);

      expect(result.originalURL).toEqual(url);
      for (let i = 0; i <= 10; i++) {
        await service.getLongURLByShortCode(shortenURL.urlCode);
      }

      const increseValue_two = await service.findOne(url);
      expect(increseValue_two.clicks).toBe(12);
    });

    it('v1: expiration check, date comparison should work', async () => {
      const url = 'https://facebook.com';
      const expiredDate = DateTime.now()
        .plus({ days: 10 })
        .toJSDate()
        .toISOString();
      const nonExpiredDate = DateTime.now()
        .plus({ days: 7 })
        .toJSDate()
        .toISOString();
      const shortenURL = await service.generateShortURLV1(
        url,
        '6472c930462e8056f1bc73a9',
      );
      expect(shortenURL.shortenURL).toBeDefined();
      const result = await service.getLongURLByShortCode(shortenURL.urlCode);

      expect(result.originalURL).toEqual(url);
      expect(
        DateTime.fromISO(expiredDate) > DateTime.fromISO(result.expireDate),
      ).toBeTruthy();
      expect(
        DateTime.fromISO(nonExpiredDate) > DateTime.fromISO(result.expireDate),
      ).toBeFalsy();
    });

    it('v2: expiration check, date comparison should work', async () => {
      const url = 'https://youtube.com';
      const expiredDate = DateTime.now()
        .plus({ days: 700 })
        .toJSDate()
        .toISOString();
      const nonExpiredDate = DateTime.now()
        .plus({ days: 7 })
        .toJSDate()
        .toISOString();
      const shortenURL = await service.generateShortURLV2(
        url,
        '6472c930462e8056f1bc73a9',
      );
      expect(shortenURL.shortenURL).toBeDefined();
      const result = await service.getLongURLByShortCode(shortenURL.urlCode);

      expect(result.originalURL).toEqual(url);
      expect(
        DateTime.fromISO(expiredDate) > DateTime.fromISO(result.expireDate),
      ).toBeTruthy();
      expect(
        DateTime.fromISO(nonExpiredDate) > DateTime.fromISO(result.expireDate),
      ).toBeFalsy();
    });
  });

  describe('Query', () => {
    beforeAll(async () => {
      const urls: string[] = [];
      for (let i = 0; i < 10; i++) {
        urls.push(`${faker.internet.url()}/fakequery`);
      }
      await Promise.all(
        urls.map(async (url) => {
          await service.generateShortURLV1(url, '6472c930462e8056f1bc73a9');
        }),
      );
    });

    it('should match the number of shorten urls', async () => {
      const url_Q1 = await service.findAll({ skip: 0, take: 5 });
      expect(url_Q1.length).toEqual(5);
      const url_Q2 = await service.findAll({ skip: 0, take: 5 });
      expect(url_Q2.length).toEqual(5);
      const url_Q3 = await service.findAll({ skip: 0, take: 10 });
      expect(url_Q3.length).toEqual(10);
    });

    it('should match partial text search query', async () => {
      const result = await service.findByText({
        text: 'fakequery',
        pagination: {
          skip: 0,
          take: 10,
        },
      });
      expect(result.length).toEqual(10);
    });
  });

  describe('Delete', () => {
    it('should delete the url', async () => {
      const url = faker.internet.url();
      await service.generateShortURLV2(url, '6472c930462e8056f1bc73a9');
      const shortenURL = await service.findOne(url);
      const deletedShortenURL = await service.deleteShortenURLById(
        shortenURL._id.toString(),
      );
      expect(deletedShortenURL.originalUrl).toEqual(url);
    });
  });
});
