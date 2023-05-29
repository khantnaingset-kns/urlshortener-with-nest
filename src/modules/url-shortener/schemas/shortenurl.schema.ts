import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { APIUser } from '../../api-user/schemas';

export type ShortenURLDocument = HydratedDocument<ShortenURL>;

@Schema({ timestamps: true })
export class ShortenURL {
  @Prop({ required: true, unique: true })
  originalUrl: string;

  @Prop({ required: true, index: true })
  urlCode: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: APIUser.name,
  })
  owner: APIUser;

  @Prop({ required: true })
  expireDate: string;

  @Prop({ required: true, default: 'V1' })
  version: string;

  @Prop({ required: true, default: 0 })
  clicks: number;
}

export const ShortenURLSchema = SchemaFactory.createForClass(ShortenURL);
