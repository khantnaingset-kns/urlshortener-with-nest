import * as argon2 from 'argon2';

import { APIUser, APIUserSchema } from './schema';
import { Connection, Model, connect } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { APIUserService } from './api-user.service';
import { CreateAPIUserDTO, UpdateAPIUserDTO } from './dto/api-user.dto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { faker } from '@faker-js/faker';
import { getModelToken } from '@nestjs/mongoose';
import { APIUserDocument } from './schema/api-user.schema';

describe('APIUserService', () => {
  let service: APIUserService;
  let apiUserModel: Model<APIUser>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    apiUserModel = mongoConnection.model(APIUser.name, APIUserSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        APIUserService,
        {
          provide: getModelToken(APIUser.name),
          useValue: apiUserModel,
        },
      ],
    }).compile();

    service = module.get<APIUserService>(APIUserService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  describe('Create', () => {
    it('should create a new APIUser', async () => {
      const createAPIUserDTO: CreateAPIUserDTO = {
        username: faker.person.fullName(),
        email: 'fake@fakermail.com',
        password: faker.internet.password(),
        role: 'Admin',
      };
      const apiUser = await service.create(createAPIUserDTO);
      expect(apiUser).toBeDefined();
      expect(apiUser.username).toEqual(createAPIUserDTO.username);
      expect(apiUser.email).toEqual(createAPIUserDTO.email);
      expect(
        await argon2.verify(apiUser.password, createAPIUserDTO.password),
      ).toBeTruthy();
      expect(apiUser.role).toEqual(createAPIUserDTO.role);
    });

    it('should throw an error if email already exists', async () => {
      const createAPIUserDTO: CreateAPIUserDTO = {
        username: faker.person.fullName(),
        email: 'fake@fakermail.com',
        password: faker.internet.password(),
        role: 'Admin',
      };
      await expect(service.create(createAPIUserDTO)).rejects.toThrow();
    });
  });

  describe('Update', () => {
    let apiUser: APIUserDocument;
    beforeAll(async () => {
      const createAPIUserDTO: CreateAPIUserDTO = {
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'Admin',
      };
      apiUser = await service.create(createAPIUserDTO);
    });

    it('should update an APIUser', async () => {
      const updateAPIUserDTO: UpdateAPIUserDTO = {
        username: 'new_user_name',
        email: 'newemail@fakermail.com',
      };
      const updatedAPIUser = await service.update(
        apiUser._id.toString(),
        updateAPIUserDTO,
      );
      expect(updatedAPIUser).toBeDefined();
      expect(updatedAPIUser.username).toEqual(updateAPIUserDTO.username);
      expect(updatedAPIUser.email).toEqual(updateAPIUserDTO.email);
    });
  });

  describe('Query', () => {
    beforeAll(async () => {
      const createAPIUsers: CreateAPIUserDTO[] = [];
      for (let i = 0; i < 10; i++) {
        createAPIUsers.push({
          username: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'URLCreator',
        });
      }

      for (let i = 0; i < 10; i++) {
        createAPIUsers.push({
          username: `fts_user mock`,
          email: `fts_email${i}@fakermail.com`,
          password: faker.internet.password(),
          role: 'URLCreator',
        });
      }
      await Promise.all(
        createAPIUsers.map(async (apiUser) => {
          await service.create(apiUser);
        }),
      );
    });

    it('should match the number of APIUsers', async () => {
      const apiUsers_Q1 = await service.findAll({ skip: 0, take: 5 });
      expect(apiUsers_Q1.length).toEqual(5);
      const apiUsers_Q2 = await service.findAll({ skip: 0, take: 5 });
      expect(apiUsers_Q2.length).toEqual(5);
      const apiUsers_Q3 = await service.findAll({ skip: 0, take: 10 });
      expect(apiUsers_Q3.length).toEqual(10);
    });

    it('should match partial text search query', async () => {
      const result = await service.findByText({
        text: 'fts_',
        pagination: {
          skip: 0,
          take: 10,
        },
      });
      expect(result.length).toEqual(10);
    });
  });
  describe('Delete', () => {
    it('should delete the APIUser', async () => {
      const createAPIUserDTO: CreateAPIUserDTO = {
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'Admin',
      };
      const apiUser = await service.create(createAPIUserDTO);
      await service.deleteById(apiUser._id.toString());
      const deletedAPIUser = await service.findById(apiUser._id.toString());
      expect(deletedAPIUser).toBeNull();
    });
  });
});
