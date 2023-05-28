import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateDTO } from './dtos';
import { TokenResponse } from './dtos/authenticate.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn().mockResolvedValue({
              token: 'testToken',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate and return token', async () => {
      const authenticateDTO: AuthenticateDTO = {
        /* authenticateDTO data */
        email: 'faker@fakermail.com',
        password: 'testPassword',
      };

      const tokenResponse: TokenResponse = {
        /* tokenResponse data */
        token: 'testToken',
      };

      const result = await controller.login(authenticateDTO);

      expect(result).toEqual(tokenResponse);
    });
  });
});
