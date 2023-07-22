import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Gender } from 'src/types.ts/types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userName: string;

  @Prop()
  score: number;

  @Prop()
  gender: Gender;

  @Prop()
  title: string;

  @Prop()
  lastName: string;

  @Prop()
  city: string;

  @Prop()
  country: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
