import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ versionKey: false })
export class Reservation {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  hotelId: Types.ObjectId;

  @Prop({ required: true })
  roomId: Types.ObjectId;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index({ roomId: 1, dateStart: 1, dateEnd: 1 }, { name: 'room_date_index' });
