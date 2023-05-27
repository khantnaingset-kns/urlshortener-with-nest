import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { APIUserService } from '../api-user/api-user.service';
import { AuthService } from './auth.service';
import { AuthenticateDTO } from './dtos';
import { config } from '../../config';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: APIUserService,
          useValue: {
            findByEmail: jest.fn().mockImplementation(async (email: string) =>
              Promise.resolve({
                email,
                username: 'XXXXXXXXXXXXX',
                password: await argon2.hash('thepassword'),
                role: 'Admin',
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Authenticate', () => {
    it('should return sign jwt', async () => {
      const credentials: AuthenticateDTO = {
        email: 'faker@fakemail.com',
        password: 'thepassword',
      };
      const { token } = await service.authenticate(credentials);
      console.log(jwt.verify(token, configService.get<string>('app.secret')));
    });
  });
});
