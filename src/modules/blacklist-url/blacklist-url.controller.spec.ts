import { BlackListURL, BlackListURLDocument } from './schemas';
import { Pagination, PartialTextSearchQuery } from '../core/interfaces';
import { Test, TestingModule } from '@nestjs/testing';

import { BlackListURLController } from './blacklist-url.controller';
import { BlackListURLService } from './blacklist-url.service';

describe('BlackListURLController', () => {
  let controller: BlackListURLController;
  let service: BlackListURLService;

  const urls = [
    {
      _id: 'uuid_123',
      url: 'http://fakeurl1.com',
      createdAt: '2023-05-27T15:00:54.464Z',
      updatedAt: '2023-05-27T15:00:54.464Z',
    },
    {
      _id: 'uuid_122',
      url: 'http://fakeurl2.com',
      createdAt: '2023-05-27T15:00:54.464Z',
      updatedAt: '2023-05-27T15:00:54.464Z',
    },
    {
      _id: 'uuid_124',
      url: 'http://fakeurl3.com',
      createdAt: '2023-05-27T15:00:54.464Z',
      updatedAt: '2023-05-27T15:00:54.464Z',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlackListURLController],
      providers: [
        {
          provide: BlackListURLService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((url) =>
                Promise.resolve({ _id: 'a uuid', url: url }),
              ),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findAll: jest
              .fn()
              .mockImplementation((pagination) => Promise.resolve(urls)),
            findByText: jest.fn().mockImplementation(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (partialTextSearchQuery: PartialTextSearchQuery) =>
                Promise.resolve([urls[0]]),
            ),
            deleteById: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((id) => Promise.resolve(urls[2])),
          },
        },
      ],
    }).compile();

    controller = module.get<BlackListURLController>(BlackListURLController);
    service = module.get<BlackListURLService>(BlackListURLService);
  });

  describe('create', () => {
    it('should create a new BlackListURL', async () => {
      const mockUrl = 'https://example.com';

      const result = await controller.create(mockUrl);

      expect(service.create).toHaveBeenCalledWith(mockUrl);
      expect(result.url).toEqual(mockUrl);
    });
  });

  describe('findAll', () => {
    it('should find all BlackListURLs with pagination', async () => {
      const mockPagination: Pagination = { skip: 0, take: 10 };

      const result = await controller.findAll(mockPagination);

      expect(service.findAll).toHaveBeenCalledWith(mockPagination);
      expect(result).toEqual(urls);
    });
  });

  describe('findByText', () => {
    it('should find BlackListURLs by text with pagination', async () => {
      const mockFilterQuery: PartialTextSearchQuery = {
        text: 'example',
        pagination: { skip: 0, take: 10 },
      };

      const result = await controller.findByText(mockFilterQuery);

      expect(service.findByText).toHaveBeenCalledWith(mockFilterQuery);
      expect(result).toEqual([urls[0]]);
    });
  });

  describe('deleteById', () => {
    it('should find BlackListURLs by text with pagination', async () => {
      const id = 'a uuid';

      const result = await controller.deleteById(id);

      expect(service.deleteById).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        message: 'API User with ID a uuid deleted successfully',
      });
    });
  });
});
