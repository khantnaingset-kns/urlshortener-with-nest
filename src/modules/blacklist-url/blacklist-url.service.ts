import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlackListURL, BlackListURLDocument } from './schemas';
import { Pagination, PartialTextSearchQuery } from '../../core/interfaces';

@Injectable()
export class BlackListURLService {
  constructor(
    @InjectModel(BlackListURL.name)
    private readonly _blackListURLModel: Model<BlackListURLDocument>,
  ) {}

  async create(url: string): Promise<BlackListURLDocument> {
    const createdBlackListURL = new this._blackListURLModel({ url });
    return createdBlackListURL.save();
  }

  async findAllWithPagination({
    skip,
    take,
  }: Pagination): Promise<BlackListURLDocument[]> {
    return this._blackListURLModel.find().skip(skip).limit(take).exec();
  }

  async findAll(): Promise<BlackListURLDocument[]> {
    return this._blackListURLModel.find().exec();
  }

  async findByURL(url): Promise<BlackListURLDocument> {
    return this._blackListURLModel.findOne({ url }).exec();
  }

  async findByText({
    text,
    pagination,
  }: PartialTextSearchQuery): Promise<BlackListURLDocument[]> {
    return this._blackListURLModel
      .find({
        url: { $regex: text, $options: 'i' },
      })
      .skip(pagination.skip)
      .limit(pagination.take)
      .select('-__v')
      .exec();
  }

  async deleteById(id: string): Promise<BlackListURLDocument> {
    return this._blackListURLModel.findByIdAndDelete(id).exec();
  }
}
