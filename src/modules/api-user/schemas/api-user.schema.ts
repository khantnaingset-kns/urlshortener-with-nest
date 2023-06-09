import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Roles } from '../enums';

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

  @Prop({ type: String, enum: Roles, default: Roles.URLCreator })
  role: Roles;
}

export const APIUserSchema = SchemaFactory.createForClass(APIUser);
