import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { IHotel } from './interfaces/hotel.interface';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';

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

  async createHotelRoom(roomData: CreateHotelRoomDto): Promise<HotelRoom> {
    try {
      // Создаем запись отеля
      const createdRoom = await this.hotelRoomModel.create(roomData);

      // Загружаем созданный номер с данными отеля, используя populate
      return this.hotelRoomModel
        .findById(createdRoom._id)
        .populate('hotelId') // Указываем поля title и description, которые нужно подгрузить из связанного отеля
        .exec();
    } catch (error) {
      console.error('Ошибка при создании номера отеля:', error);
      throw new Error('Не удалось создать номер отеля');
    }
  }
}
