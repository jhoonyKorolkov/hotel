import { Types } from 'mongoose';
import { IHotel } from './hotel.interface';

export interface IHotelRoom {
  _id: Types.ObjectId;
  description: string;
  images: string[];
  isEnabled: boolean;
  hotelId: Types.ObjectId | IHotel;
}
