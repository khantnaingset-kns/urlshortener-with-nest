import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { APIUser } from './schemas';
import { Model } from 'mongoose';
import { CreateAPIUserDTO, UpdateAPIUserDTO } from './dtos/api-user.dto';
import * as argon2 from 'argon2';
import {
  Pagination,
  PartialTextSearchQuery,
  FilterByRoleQuery,
} from '../../core/interfaces';
import { APIUserDocument } from './schemas/api-user.schema';
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

  async findByEmail(email: string): Promise<APIUserDocument> {
    return this._apiUserModel.findOne({ email }).select('-__v').exec();
  }

  async findAll({ skip, take }: Pagination): Promise<APIUserDocument[]> {
    return this._apiUserModel
      .find()
      .skip(skip)
      .limit(take)
      .select('-__v')
      .exec();
  }

  async findByText({
    text,
    pagination,
  }: PartialTextSearchQuery): Promise<APIUserDocument[]> {
    return this._apiUserModel
      .find({
        $or: [
          { username: { $regex: text, $options: 'i' } },
          { email: { $regex: text, $options: 'i' } },
        ],
      })
      .skip(pagination.skip)
      .limit(pagination.take)
      .select('-__v')
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
      .select('-__v')
      .exec();
  }
  async findById(apiUserID: string): Promise<APIUserDocument> {
    return this._apiUserModel.findById(apiUserID).select('-__v').exec();
  }

  async update(
    apiUserID: string,
    createAPIUserDTO: UpdateAPIUserDTO,
  ): Promise<APIUserDocument> {
    return this._apiUserModel
      .findByIdAndUpdate(apiUserID, createAPIUserDTO, { new: true })
      .select('-__v')
      .exec();
  }

  async deleteById(apiUserID: string): Promise<APIUserDocument> {
    return this._apiUserModel.findByIdAndDelete(apiUserID).exec();
  }
}
