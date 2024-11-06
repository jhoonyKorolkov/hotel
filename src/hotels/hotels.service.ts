import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { SearchRoomsParamsDto } from './dto/search-room-params.dto';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { HotelRoomResponseDto } from './dto/hotel-room-response.dto';
import { IHotel } from './interfaces/hotel.interface';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async createHotel(hotel: CreateHotelDto): Promise<HotelResponseDto> {
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

  async createHotelRoom(roomData: CreateHotelRoomDto): Promise<HotelRoomResponseDto> {
    const createdRoom = await this.hotelRoomModel.create(roomData);

    const room = await this.hotelRoomModel
      .findById(createdRoom._id)
      .populate<{ hotelId: IHotel }>('hotelId', 'title');

    console.log(room);

    return {
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: room.hotelId._id.toString(),
        title: room.hotelId.title,
      },
    };
  }

  async searchHotelRooms(params: SearchRoomsParamsDto): Promise<HotelRoomResponseDto[]> {
    const { limit, offset, hotel, isEnabled } = params;

    const filter: any = {
      hotelId: hotel,
    };

    if (isEnabled === true) {
      filter.isEnabled = true;
    }

    const rooms = await this.hotelRoomModel
      .find(filter)
      .limit(limit)
      .skip(offset)
      .populate<{ hotelId: IHotel }>('hotelId', 'title');

    return rooms.map((room) => ({
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: room.hotelId._id.toString(),
        title: room.hotelId.title,
      },
    }));
  }

  async searchHotelRoomById(id: string) {
    const room = await this.hotelRoomModel
      .findById(id)
      .populate<{ hotelId: IHotel }>('hotelId', 'title description');

    if (!room) {
      throw new NotFoundException('Номер с таким ID не найден');
    }

    return {
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: room.hotelId._id.toString(),
        title: room.hotelId.title,
        description: room.hotelId.description,
      },
    };
  }
}
