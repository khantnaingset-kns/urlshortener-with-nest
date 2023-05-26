import * as argon2 from 'argon2';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Role } from '../enum';

export type APIUserDocument = HydratedDocument<APIUser>;

@Schema({ timestamps: true })
export class APIUser {
  @Prop({ required: true, type: String, unique: true, index: true })
  email: string;

  @Prop({ required: true, type: String })
  username: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}

export const APIUserSchema = SchemaFactory.createForClass(APIUser);
