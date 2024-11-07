import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { SearchRoomParamsDto } from './dto/search-room-params.dto';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { HotelRoomResponseDto } from './dto/hotel-room-response.dto';
import { IHotel } from './interfaces/hotel.interface';
import { CustomLoggerService } from '../common/logger/services/custom-logger.service';
import { SearchHotelParamsDto } from './dto/search-hotel-params.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,
    private readonly logger: CustomLoggerService,
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

  async searchHotels(params: SearchHotelParamsDto): Promise<HotelResponseDto[]> {
    try {
      const { limit, offset, title } = params;

      const filter: any = {};

      if (title) {
        filter.title = title;
      }

      const hotels = await this.hotelModel.find(filter).limit(limit).skip(offset);

      return hotels.map((hotel) => ({
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      }));
    } catch (error) {
      this.logger.error(`Ошибка при поиске отелей: ${error.message}`, error.stack);
    }
  }

  async searchHotelRooms(params: SearchRoomParamsDto): Promise<HotelRoomResponseDto[]> {
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

  async searchHotelRoomById(id: string): Promise<HotelRoomResponseDto> {
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

  async updateHotel(id: string, params: UpdateHotelDto): Promise<HotelResponseDto> {
    try {
      const { title, description } = params;
      const hotelExists = await this.hotelModel.findByIdAndUpdate(
        id,
        { title, description },
        { new: true },
      );

      if (!hotelExists) {
        this.logger.error(`Отель с id ${id} не найден`);
        throw new NotFoundException(`Отель с id ${id} не найден`);
      }

      return {
        id,
        title,
        description,
      };
    } catch (error) {
      this.logger.error('Ошибка при обновлении отеля', error.stack);
      throw error;
    }
  }

  async updateHotelRoom(id: string, params: UpdateHotelRoomDto): Promise<HotelRoomResponseDto> {
    try {
      const { description, images, isEnabled, hotelId } = params;
      const updateData: any = {};

      if (description !== undefined) updateData.description = description;
      if (isEnabled !== undefined) updateData.isEnabled = isEnabled;
      if (images && images.length > 0) updateData.images = images;

      if (hotelId !== undefined) {
        const hotelExists = await this.hotelModel.findById(hotelId);
        if (!hotelExists) {
          this.logger.error(`Отель с id ${hotelId} не найден`);
          throw new NotFoundException(`Отель с id ${hotelId} не найден`);
        }
        updateData.hotelId = hotelId;
      }

      const room = await this.hotelRoomModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate<{ hotelId: IHotel }>('hotelId', 'title', 'description');

      if (!room) {
        this.logger.error(`Комната с id ${id} не найдена`);
        throw new NotFoundException(`Комната с id ${id} не найдена`);
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
    } catch (error) {
      this.logger.error('Ошибка при обновлении отеля', error.stack);
      throw error;
    }
  }
}
