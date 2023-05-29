import { Test, TestingModule } from '@nestjs/testing';

import { DateTime } from 'luxon';
import { URLShortenerController } from './url-shortener.controller';
import { URLShortenerService } from './url-shortener.service';

describe('URLShortenerController', () => {
  let controller: URLShortenerController;
  let service: URLShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [URLShortenerController],
      providers: [
        {
          provide: URLShortenerService,
          useValue: {
            generateShortURLV1: jest
              .fn()
              .mockImplementation((_longURL, _userId) =>
                Promise.resolve({
                  urlCode: 'abc123',
                  shortenURL: 'https://shorturl.com/abc123',
                  expireDate: DateTime.now(),
                }),
              ),
            generateShortURLV2: jest
              .fn()
              .mockImplementation((_longURL, _userId) =>
                Promise.resolve({
                  urlCode: 'abc123',
                  shortenURL: 'https://shorturl.com/abc123',
                  expireDate: DateTime.now(),
                }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<URLShortenerController>(URLShortenerController);
    service = module.get<URLShortenerService>(URLShortenerService);
  });

  describe('shortenURLV1', () => {
    it('should generate a short URL for V1', async () => {
      const mockRequest = { userId: '6472c930462e8056f1bc73a9' };
      const mockShortenURLRequest = { longUrl: 'https://example.com' };

      const result = await controller.shortenURLV1(
        mockShortenURLRequest,
        mockRequest,
      );

      expect(result).toBeDefined();
      expect(service.generateShortURLV1).toHaveBeenCalledWith(
        mockShortenURLRequest.longUrl,
        mockRequest.userId,
      );
    });
  });

  describe('shortenURLV2', () => {
    it('should generate a long URL for V2', async () => {
      const mockRequest = { userId: '6472c930462e8056f1bc73a9' };
      const mockShortenURLRequest = { longUrl: 'https://example.com' };

      const result = await controller.shortenURLV2(
        mockShortenURLRequest,
        mockRequest,
      );

      expect(result).toBeDefined();
      expect(service.generateShortURLV2).toHaveBeenCalledWith(
        mockShortenURLRequest.longUrl,
        mockRequest.userId,
      );
    });
  });
});
