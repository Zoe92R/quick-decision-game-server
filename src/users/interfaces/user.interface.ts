import { Document, ObjectId } from 'mongoose';

import { Gender } from 'src/types.ts/types';

export interface IUser extends Document {
  readonly _id: ObjectId;
  readonly userName: string;
  readonly score: number;
  readonly gender?: Gender;
  readonly title?: string;
  readonly lastName?: string;
  readonly city?: string;
  readonly country?: string;
}
