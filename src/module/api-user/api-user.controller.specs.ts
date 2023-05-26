import { CreateAPIUserDTO, UpdateAPIUserDTO } from './dto/api-user.dto';
import { Test, TestingModule } from '@nestjs/testing';

import { APIUserController } from './api-user.controller';
import { APIUserDocument } from './schema/api-user.schema';
import { APIUserService } from './api-user.service';

describe('APIUserController', () => {
  let controller: APIUserController;
  let service: APIUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [APIUserController],
      providers: [
        {
          provide: APIUserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByText: jest.fn(),
            filterByRole: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
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
      };
      const createdUser: APIUserDocument = {
        /* created user data */
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(createDTO);

      expect(service.create).toHaveBeenCalledWith(createDTO);
      expect(result).toBe(createdUser);
    });
  });

  describe('findAll', () => {
    it('should get all API users', async () => {
      const pagination: Pagination = {
        /* pagination data */
      };
      const users: APIUserDocument[] = [
        /* array of users */
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll(pagination);

      expect(service.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toBe(users);
    });
  });

  describe('findByText', () => {
    it('should search API users by text', async () => {
      const searchQuery: PartialTextSearchQuery = {
        /* search query data */
      };
      const matchingUsers: APIUserDocument[] = [
        /* array of matching users */
      ];

      jest.spyOn(service, 'findByText').mockResolvedValue(matchingUsers);

      const result = await controller.findByText(searchQuery);

      expect(service.findByText).toHaveBeenCalledWith(searchQuery);
      expect(result).toBe(matchingUsers);
    });
  });

  describe('filterByRole', () => {
    it('should filter API users by role', async () => {
      const filterQuery: FilterByRoleQuery = {
        /* filter query data */
      };
      const filteredUsers: APIUserDocument[] = [
        /* array of filtered users */
      ];

      jest.spyOn(service, 'filterByRole').mockResolvedValue(filteredUsers);

      const result = await controller.filterByRole(filterQuery);

      expect(service.filterByRole).toHaveBeenCalledWith(filterQuery);
      expect(result).toBe(filteredUsers);
    });
  });

  describe('findById', () => {
    it('should get an API user by ID', async () => {
      const apiUserID = '123';
      const foundUser: APIUserDocument = {
        /* found user data */
      };

      jest.spyOn(service, 'findById').mockResolvedValue(foundUser);

      const result = await controller.findById(apiUserID);

      expect(service.findById).toHaveBeenCalledWith(apiUserID);
      expect(result).toBe(foundUser);
    });
  });

  describe('update', () => {
    it('should update an API user by ID', async () => {
      const apiUserID = '123';
      const updateDTO: UpdateAPIUserDTO = {
        /* updateDTO data */
      };
      const updatedUser: APIUserDocument = {
        /* updated user data */
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(apiUserID, updateDTO);

      expect(service.update).toHaveBeenCalledWith(apiUserID, updateDTO);
      expect(result).toBe(updatedUser);
    });
  });

  describe('deleteById', () => {
    it('should delete an API user by ID', async () => {
      const apiUserID = '123';
      const deletedUser: APIUserDocument = {
        /* deleted user data */
      };

      jest.spyOn(service, 'deleteById').mockResolvedValue(deletedUser);

      const result = await controller.deleteById(apiUserID);

      expect(service.deleteById).toHaveBeenCalledWith(apiUserID);
      expect(result).toBe(deletedUser);
    });
  });
});
