import { Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  sentAt: Date;
  readAt?: Date | null;
}
