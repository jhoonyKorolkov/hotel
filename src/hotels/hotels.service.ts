import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { IHotel } from './interfaces/hotel.interface';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async createHotel(hotel: CreateHotelDto): Promise<IHotel> {
    const existsHotel = await this.hotelModel.findOne({ title: hotel.title });

    if (existsHotel) {
      throw new ConflictException('Hotel already exist');
    }

    const createdHotel = await this.hotelModel.create(hotel);
    return {
      id: createdHotel._id.toString(),
      title: createdHotel.title,
      description: createdHotel.description,
    };
  }
}
