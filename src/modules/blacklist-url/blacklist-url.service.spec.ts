import {
  BlackListURL,
  BlackListURLDocument,
  BlackListURLSchema,
} from './schemas';
import { Connection, Model, connect } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { BlackListURLService } from './blacklist-url.service';
import { LoggerModule } from '@app/logger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';
import { getModelToken } from '@nestjs/mongoose';

describe('BlackListURLService', () => {
  let service: BlackListURLService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let model: Model<BlackListURLDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    model = mongoConnection.model<BlackListURLDocument>(
      BlackListURL.name,
      BlackListURLSchema,
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.registerForRoot({ logLevel: 'verbose' })],
      providers: [
        BlackListURLService,
        {
          provide: getModelToken(BlackListURL.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<BlackListURLService>(BlackListURLService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    it('should create a new blacklist url', async () => {
      const url = 'https://www.google.com';

      const blackListURL = await service.create(url);
      expect(blackListURL).toBeDefined();
      expect(blackListURL.url).toBe(url);
    });

    it('should throw an error if url already exists', async () => {
      const url = 'https://www.google.com';
      await expect(service.create(url)).rejects.toThrow();
    });
  });
  describe('Query', () => {
    beforeAll(async () => {
      const urls: string[] = [];
      for (let i = 0; i < 10; i++) {
        urls.push(`fake_${faker.internet.url()}`);
      }
      await Promise.all(
        urls.map(async (url) => {
          await service.create(url);
        }),
      );
    });

    it('should match the number of urls', async () => {
      const url_Q1 = await service.findAll({ skip: 0, take: 5 });
      expect(url_Q1.length).toEqual(5);
      const url_Q2 = await service.findAll({ skip: 0, take: 5 });
      expect(url_Q2.length).toEqual(5);
      const url_Q3 = await service.findAll({ skip: 0, take: 10 });
      expect(url_Q3.length).toEqual(10);
    });

    it('should match partial text search query', async () => {
      const result = await service.findByText({
        text: 'fake_',
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
      const blackListURL = await service.create(url);
      await service.deleteById(blackListURL._id.toString());
      const deletedURL = await service.findByURL(url);
      expect(deletedURL).toBeNull();
    });
  });
});
