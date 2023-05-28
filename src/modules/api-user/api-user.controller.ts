import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { APIUserService } from './api-user.service';
import {
  CreateAPIUserDTO,
  APIUserResponse,
  UpdateAPIUserDTO,
  DeleteRouteSuccessResponse,
} from './dtos/';
import { APIUserDocument } from './schemas/api-user.schema';
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
  FilterByRoleQuery,
  Pagination,
  PartialTextSearchQuery,
} from '../core/interfaces';
import { JwtAuthGuard, RoleGuard } from '../../guards';
import { Role } from '../../decorators';
import { Roles } from './enums';

@ApiTags('API Users')
@Controller({ path: 'api-users', version: '1' })
export class APIUserController {
  constructor(private readonly apiUserService: APIUserService) {}

  @ApiOperation({ summary: 'Create a new API user' })
  @ApiBody({ type: CreateAPIUserDTO })
  @ApiResponse({
    status: 201,
    description: 'The created API user',
    type: APIUserResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({
    description: 'Server error Occured at registration',
  })
  @HttpCode(201)
  @Post('register')
  async create(
    @Body() createAPIUserDTO: CreateAPIUserDTO,
  ): Promise<APIUserDocument> {
    return this.apiUserService.create(createAPIUserDTO);
  }

  @ApiOperation({ summary: 'Get all API users' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of API users',
    type: APIUserResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(Roles.Admin)
  @HttpCode(200)
  @Get()
  async findAll(@Query() pagination: Pagination): Promise<APIUserDocument[]> {
    return this.apiUserService.findAll(pagination);
  }

  @ApiOperation({ summary: 'Search API Users by text' })
  @ApiQuery({ name: 'text' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of matching API Users',
    type: APIUserResponse,
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
    @Query() searchQuery: PartialTextSearchQuery,
  ): Promise<APIUserDocument[]> {
    return this.apiUserService.findByText(searchQuery);
  }

  @ApiOperation({ summary: 'Filter API Users by role' })
  @ApiQuery({ name: 'role' })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of filtered API users',
    type: APIUserResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(Roles.Admin)
  @HttpCode(200)
  @Get('filter-by-role')
  async filterByRole(
    @Query() filterQuery: FilterByRoleQuery,
  ): Promise<APIUserDocument[]> {
    return this.apiUserService.filterByRole(filterQuery);
  }

  @ApiOperation({ summary: 'Get an API User by ID' })
  @ApiParam({ name: 'id', description: 'API User ID' })
  @ApiResponse({
    status: 200,
    description: 'The found API User',
    type: APIUserResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(Roles.Admin)
  @HttpCode(200)
  @Get(':id')
  async findById(@Param('id') apiUserID: string): Promise<APIUserDocument> {
    return this.apiUserService.findById(apiUserID);
  }

  @ApiOperation({ summary: 'Update an API User by ID' })
  @ApiParam({ name: 'id', description: 'API User ID' })
  @ApiBody({ type: UpdateAPIUserDTO })
  @ApiResponse({
    status: 200,
    description: 'The updated API User',
    type: APIUserResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') apiUserID: string,
    @Body() updateAPIUserDTO: UpdateAPIUserDTO,
  ): Promise<APIUserDocument> {
    return this.apiUserService.update(apiUserID, updateAPIUserDTO);
  }

  @ApiOperation({ summary: 'Delete an API User by ID' })
  @ApiParam({ name: 'id', description: 'API User ID' })
  @ApiResponse({
    status: 200,
    description: 'The deleted API User',
    type: DeleteRouteSuccessResponse,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async deleteById(@Param('id') apiUserID: string): Promise<any> {
    await this.apiUserService.deleteById(apiUserID);
    return {
      message: `API User with ID ${apiUserID} deleted successfully`,
    };
  }
}
