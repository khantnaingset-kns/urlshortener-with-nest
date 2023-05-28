import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticateDTO } from './dtos';
import { TokenResponse } from './dtos/authenticate.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate and Get Token' })
  @ApiBody({ type: AuthenticateDTO })
  @ApiResponse({
    status: 201,
    description: 'Login Successful, return token',
    type: TokenResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error Occured at registration',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() authenticateDTO: AuthenticateDTO) {
    return this._authService.authenticate(authenticateDTO);
  }
}
