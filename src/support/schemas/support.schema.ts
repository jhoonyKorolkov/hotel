import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Message, MessageSchema } from './message.shema';

export type SupportDocument = HydratedDocument<Support>;

@Schema({ versionKey: false, timestamps: { createdAt: true, updatedAt: false } })
export class Support {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Message', default: [] })
  messages: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
