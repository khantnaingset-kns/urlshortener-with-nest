import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { APIUser } from './schema';
import { Model } from 'mongoose';
import { CreateAPIUserDTO, UpdateAPIUserDTO } from './dto/api-user.dto';
import * as argon2 from 'argon2';
import {
  Pagination,
  PartialTextSearchQuery,
  FilterByRoleQuery,
} from './interface';
import { APIUserDocument } from './schema/api-user.schema';
import { LoggerService } from '@app/logger';
@Injectable()
export class APIUserService {
  constructor(
    @InjectModel(APIUser.name) private readonly _apiUserModel: Model<APIUser>,
    private readonly _loggerService: LoggerService,
  ) {}

  async create(createAPIUserDTO: CreateAPIUserDTO): Promise<APIUserDocument> {
    const createdAPIUser = new this._apiUserModel({
      username: createAPIUserDTO.username,
      email: createAPIUserDTO.email,
      password: await argon2.hash(createAPIUserDTO.password),
      role: createAPIUserDTO.role,
    });
    return createdAPIUser.save();
  }

  async findAll({ skip, take }: Pagination): Promise<APIUserDocument[]> {
    return this._apiUserModel.find().skip(skip).limit(take).exec();
  }

  async findByText({
    text,
    pagination,
  }: PartialTextSearchQuery): Promise<APIUserDocument[]> {
    return this._apiUserModel
      .find({
        $or: [{ username: { $regex: text } }, { email: { $regex: text } }],
      })
      .skip(pagination.skip)
      .limit(pagination.take)
      .exec();
  }

  async filterByRole({
    role,
    pagination,
  }: FilterByRoleQuery): Promise<APIUserDocument[]> {
    return this._apiUserModel
      .find({ role: role })
      .skip(pagination.skip)
      .limit(pagination.take)
      .exec();
  }
  async findById(apiUserID: string): Promise<APIUserDocument> {
    return this._apiUserModel.findById(apiUserID).exec();
  }

  async update(
    apiUserID: string,
    createAPIUserDTO: UpdateAPIUserDTO,
  ): Promise<APIUserDocument> {
    return this._apiUserModel
      .findByIdAndUpdate(apiUserID, createAPIUserDTO, { new: true })
      .exec();
  }

  async deleteById(apiUserID: string): Promise<APIUserDocument> {
    return this._apiUserModel.findByIdAndDelete(apiUserID).exec();
  }
}
