import { CreateAPIUserDTO, UpdateAPIUserDTO } from './dtos';
import {
  FilterByRoleQuery,
  Pagination,
  PartialTextSearchQuery,
} from './interfaces';
import { Test, TestingModule } from '@nestjs/testing';

import { APIUserController } from './api-user.controller';
import { APIUserService } from './api-user.service';
import { faker } from '@faker-js/faker';

describe('APIUserController', () => {
  let controller: APIUserController;
  let service: APIUserService;

  const mockUUID = faker.string.uuid();
  const apiUsers = [
    {
      _id: '64721b2611933324dfbe2d2a',
      email: 'faker@fakermail.com',
      username: 'fakerTT',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$oy5Bzf/A+KENf+2KYJKk7w$iTQWNesymR8+gRwFzDz7veJZbgYIs6DaVjCFwOM5dN8',
      role: 'Admin',
      createdAt: '2023-05-27T15:00:54.464Z',
      updatedAt: '2023-05-27T15:00:54.464Z',
    },
    {
      _id: '64722471eb76a5997b20459d',
      email: 'faker2@fakermail.com',
      username: 'fakerTT',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$jhkkcx0TlwpO8APUpK7iCQ$HwdPy1K2Patekvd0Rlx4QZ58JabrOPC4kjykkSVC/tw',
      role: 'Admin',
      createdAt: '2023-05-27T15:40:33.129Z',
      updatedAt: '2023-05-27T15:40:33.129Z',
    },
    {
      _id: '647224c36cb20de54bb2e731',
      email: 'faker3@fakermail.com',
      username: 'fakerTT',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$lloYfmX1Z16rk0hmDDbXJA$ixczKOzMq6Sg7faJv32RGZ25FbyvEgMbzkiAfvjlIEY',
      role: 'Admin',
      createdAt: '2023-05-27T15:41:55.535Z',
      updatedAt: '2023-05-27T15:41:55.535Z',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [APIUserController],
      providers: [
        {
          provide: APIUserService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((dto: CreateAPIUserDTO) =>
                Promise.resolve({ _id: mockUUID, ...dto }),
              ),
            findAll: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((pagination: Pagination) =>
                Promise.resolve(apiUsers),
              ),
            findByText: jest.fn().mockImplementation(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (partialTextSearchQuery: PartialTextSearchQuery) =>
                Promise.resolve(apiUsers),
            ),
            filterByRole: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((filterByRoleQuery: FilterByRoleQuery) =>
                Promise.resolve([apiUsers[0], apiUsers[1]]),
              ),
            findById: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((apiUserId: string) =>
                Promise.resolve([apiUsers[0]]),
              ),
            update: jest
              .fn()
              .mockImplementation(
                (apiUserId: string, updateUserDTO: UpdateAPIUserDTO) =>
                  Promise.resolve({ _id: apiUserId, ...updateUserDTO }),
              ),
            deleteById: jest
              .fn()
              .mockImplementation((apiUserId: string) =>
                Promise.resolve(apiUsers[1]),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<APIUserController>(APIUserController);
    service = module.get<APIUserService>(APIUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new API user', async () => {
      const createDTO: CreateAPIUserDTO = {
        /* createDTO data */
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: 'admin',
      };

      const result = await controller.create(createDTO);

      expect(service.create).toHaveBeenCalledWith(createDTO);
      expect(result._id).toBe(mockUUID);
      expect(result.email).toBe(createDTO.email);
      expect(result.username).toBe(createDTO.username);
      expect(result.role).toBe(createDTO.role);
    });
  });

  describe('findAll', () => {
    it('should get all API users', async () => {
      const pagination: Pagination = {
        /* pagination data */
        skip: 0,
        take: 10,
      };

      const result = await controller.findAll(pagination);

      expect(service.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toBe(apiUsers);
    });
  });

  describe('findByText', () => {
    it('should search API users by text', async () => {
      const searchQuery: PartialTextSearchQuery = {
        /* search query data */
        text: 'text',
        pagination: {
          skip: 0,
          take: 10,
        },
      };

      const result = await controller.findByText(searchQuery);

      expect(service.findByText).toHaveBeenCalledWith(searchQuery);
      expect(result).toBe(apiUsers);
    });
  });

  describe('filterByRole', () => {
    it('should filter API users by role', async () => {
      const filterByRoleQuery: FilterByRoleQuery = {
        /* filter query data */
        role: 'Admin',
        pagination: {
          skip: 0,
          take: 10,
        },
      };

      const result = await controller.filterByRole(filterByRoleQuery);

      expect(service.filterByRole).toHaveBeenCalledWith(filterByRoleQuery);
      expect(result).toBe([apiUsers[0], apiUsers[1]]);
    });
  });

  describe('findById', () => {
    it('should get an API user by ID', async () => {
      const apiUserID = '123';

      const result = await controller.findById(apiUserID);

      expect(service.findById).toHaveBeenCalledWith(apiUserID);
      expect(result).toBe(apiUsers[0]);
    });
  });

  describe('update', () => {
    it('should update an API user by ID', async () => {
      const apiUserID = '123';
      const updateDTO: UpdateAPIUserDTO = {
        /* updateDTO data */
        email: 'updateFakermail@fakermail.com',
        username: 'newUsername',
      };

      const result = await controller.update(apiUserID, updateDTO);

      expect(service.update).toHaveBeenCalledWith(apiUserID, updateDTO);
      expect(result._id).toBe(apiUserID);
      expect(result.email).toBe(updateDTO.email);
      expect(result.username).toBe(updateDTO.username);
    });
  });

  describe('deleteById', () => {
    it('should delete an API user by ID', async () => {
      const apiUserID = '123';

      const result = await controller.deleteById(apiUserID);

      expect(service.deleteById).toHaveBeenCalledWith(apiUserID);
      expect(result).toBe(apiUsers[1]);
    });
  });
});
