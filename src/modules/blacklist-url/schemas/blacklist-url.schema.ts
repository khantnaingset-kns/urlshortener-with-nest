import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type BlackListURLDocument = HydratedDocument<BlackListURL>;

@Schema({ timestamps: true, autoIndex: true })
export class BlackListURL {
  @Prop({ required: true, unique: true })
  url: string;
}

export const BlackListURLSchema = SchemaFactory.createForClass(BlackListURL);
