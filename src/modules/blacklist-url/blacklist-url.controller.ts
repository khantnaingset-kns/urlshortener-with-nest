import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { BlackListURLService } from './blacklist-url.service';
import { BlackListURL, BlackListURLDocument } from './schemas';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BlacklistURLDeleteResponse,
  BlacklistURLResponse,
  BlacklistURLListDto,
  BlacklistURLDto,
} from './dtos';
import { Role } from '../../decorators';

import { JwtAuthGuard, RoleGuard } from '../../guards';
import { Pagination, PartialTextSearchQuery } from '../../core/interfaces';
import { EUserRole } from 'libs/core';

@ApiTags('blacklist-url')
@Controller({
  path: 'blacklist-url',
  version: '1',
})
export class BlackListURLController {
  constructor(private readonly _blackListURLService: BlackListURLService) {}

  @ApiOperation({ summary: 'Create a BlackListed URL' })
  @ApiBody({ type: BlacklistURLDto })
  @ApiResponse({
    status: 201,
    description: 'Success message',
    type: BlacklistURLResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({
    description: 'Server error Occurred at registration',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(EUserRole.ADMIN)
  @HttpCode(201)
  @Post()
  async create(
    @Body() createBlackListURLDto: BlacklistURLDto,
  ): Promise<BlackListURL> {
    return this._blackListURLService.create(createBlackListURLDto.url);
  }

  @ApiOperation({ summary: 'Get all BlackListed URL' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of BlackListed URL',
    type: BlacklistURLResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(EUserRole.ADMIN)
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() pagination: Pagination,
  ): Promise<BlackListURLDocument[]> {
    return this._blackListURLService.findAllWithPagination(pagination);
  }

  @ApiOperation({ summary: 'Get all BlackListed URL' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of BlackListed URL',
    type: BlacklistURLListDto,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(EUserRole.ADMIN)
  @HttpCode(200)
  @Get('search')
  async findByText(
    @Query() filterQuery: PartialTextSearchQuery,
  ): Promise<BlackListURLDocument[]> {
    return this._blackListURLService.findByText(filterQuery);
  }

  @ApiOperation({ summary: 'Delete an Blacklisted URL by ID' })
  @ApiParam({ name: 'id', description: 'BlackListURL ID' })
  @ApiResponse({
    status: 200,
    description: 'The deleted API User',
    type: BlacklistURLDeleteResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<any> {
    await this._blackListURLService.deleteById(id);
    return {
      message: `API User with ID ${id} deleted successfully`,
    };
  }
}
