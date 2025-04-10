import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ versionKey: false, timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, default: () => new Date() })
  sentAt: Date;

  @Prop({ default: null })
  readAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
