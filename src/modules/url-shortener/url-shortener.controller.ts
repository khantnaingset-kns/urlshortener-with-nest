import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';

import { JwtAuthGuard, RoleGuard } from '../../guards';
import { URLShortenerService } from './url-shortener.service';
import { Role } from '../../decorators';
import { Roles } from '../api-user/enums';
import { Pagination, PartialTextSearchQuery } from '../../core/interfaces';
import { ShortenURLDocument } from './schemas';
import {
  ShortenURLMultipleResponse,
  ShortenURLRequest,
  ShortenURLSingleResponse,
} from './dtos/url-shortener.dto';

@ApiTags('urlshortener')
@Controller('api/urlshortener')
export class URLShortenerController {
  constructor(private readonly _urlShortenerService: URLShortenerService) {}

  @ApiOperation({
    summary:
      'V1: Shorten the URL from Long URL. For V1, generate URL is short but expiration is not more than 9 days',
  })
  @ApiBody({ type: ShortenURLRequest })
  @ApiResponse({
    status: 201,
    description: 'Success message',
    type: ShortenURLSingleResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({
    description: 'Server error Occured at registration',
  })
  @ApiBearerAuth()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('shorten')
  async shortenURLV1(
    @Body() shortenURLRequest: ShortenURLRequest,
    @Req() req: any,
  ) {
    const result = await this._urlShortenerService.generateShortURLV1(
      shortenURLRequest.longUrl,
      req.userId,
    );
    if (result == null) {
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
      return result;
    }
  }

  @ApiOperation({
    summary:
      'V2: Shorten the URL from Long URL. For V2, generate URL is long but expiration is not more than 3 years',
  })
  @ApiBody({ type: ShortenURLRequest })
  @ApiResponse({
    status: 201,
    description: 'Success message',
    type: ShortenURLSingleResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({
    description: 'Server error Occured at registration',
  })
  @ApiBearerAuth()
  @Version('2')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('shorten')
  async shortenURLV2(
    @Body() shortenURLRequest: ShortenURLRequest,
    @Req() req: any,
  ) {
    const result = await this._urlShortenerService.generateShortURLV2(
      shortenURLRequest.longUrl,
      req.userId,
    );
    if (result == null) {
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
      return result;
    }
  }

  @ApiOperation({ summary: 'Get all Shortened URL' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of Shortened URL',
    type: ShortenURLMultipleResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(Roles.Admin)
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() pagination: Pagination,
  ): Promise<ShortenURLDocument[]> {
    return this._urlShortenerService.findAll(pagination);
  }

  @ApiOperation({ summary: 'Search Shortened URL by Text' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of BlackListed URL',
    type: ShortenURLMultipleResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(Roles.Admin)
  @HttpCode(200)
  @Get('search')
  async findByText(
    @Query() filterQuery: PartialTextSearchQuery,
  ): Promise<ShortenURLDocument[]> {
    return this._urlShortenerService.findByText(filterQuery);
  }

  @ApiOperation({ summary: 'Delete an Blacklisted URL by ID' })
  @ApiParam({ name: 'id', description: 'BlackListURL ID' })
  @ApiResponse({
    status: 200,
    description: 'The deleted API User',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<any> {
    await this._urlShortenerService.deleteShortenURLById(id);
  }
}
