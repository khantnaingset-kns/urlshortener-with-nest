import * as argon2 from 'argon2';

import { Injectable, NotFoundException } from '@nestjs/common';

import { APIUserService } from '../api-user/api-user.service';
import { Authenticate } from './interfaces';
import { AuthenticateDTO } from './dtos';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly _apiUserService: APIUserService,
    private readonly _configService: ConfigService,
  ) {}

  async authenticate(authenticateDTO: AuthenticateDTO): Promise<Authenticate> {
    const apiUser = await this._apiUserService.findByEmail(
      authenticateDTO.email,
    );
    if (!apiUser) {
      throw new NotFoundException('Invalid credentials');
    } else {
      if (await argon2.verify(apiUser.password, authenticateDTO.password)) {
        const token = sign(
          { ...apiUser },
          this._configService.get<string>('app.secret'),
        );
        return { token };
      } else {
        throw new NotFoundException('Invalid credentials');
      }
    }
  }
}
