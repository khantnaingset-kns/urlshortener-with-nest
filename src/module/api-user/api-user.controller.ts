import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { APIUserService } from './api-user.service';
import { CreateAPIUserDTO, UpdateAPIUserDTO } from './dto/api-user.dto';
import { APIUser, APIUserDocument } from './schema/api-user.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  FilterByRoleQuery,
  Pagination,
  PartialTextSearchQuery,
} from './interface';

@ApiTags('API Users')
@Controller('api-users')
export class APIUserController {
  constructor(private readonly apiUserService: APIUserService) {}

  @ApiOperation({ summary: 'Create a new API user' })
  @ApiBody({ type: CreateAPIUserDTO })
  @ApiResponse({
    status: 201,
    description: 'The created API user',
    type: APIUser,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({
    description: 'Server error Occured at registration',
  })
  @Post()
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
    type: APIUser,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
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
    type: APIUser,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
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
    type: APIUser,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
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
    type: APIUser,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
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
    type: APIUser,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
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
    type: APIUser,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Error Occured at Server' })
  @Delete(':id')
  async deleteById(@Param('id') apiUserID: string): Promise<APIUserDocument> {
    return this.apiUserService.deleteById(apiUserID);
  }
}
