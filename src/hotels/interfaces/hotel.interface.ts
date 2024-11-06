import { Types } from 'mongoose';

export interface IHotel {
  _id: Types.ObjectId;
  title: string;
  description?: string;
}
