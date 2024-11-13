import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import mongoose, { Model, Types } from 'mongoose';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CustomLoggerService } from '../common/logger/services/custom-logger.service';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from '../hotels/schemas/hotel-room.schema';
import { ResponseReservationDto } from './dto/response-reservation.dto';
import { IHotel } from '../hotels/interfaces/hotel.interface';
import { IHotelRoom } from '../hotels/interfaces/hotel-room.interface';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,

    private readonly logger: CustomLoggerService,
  ) {}

  async clientReservation(
    data: CreateReservationDto,
    id: Types.ObjectId,
  ): Promise<ResponseReservationDto> {
    try {
      const { hotelRoom, dateStart, dateEnd } = data;

      const hotelRoomData = await this.hotelRoomModel.findById(hotelRoom);

      if (!hotelRoomData) {
        throw new BadRequestException('Номер с указанным ID не существует.');
      }
      const { _id: roomId, hotelId, description, images, isEnabled } = hotelRoomData;

      if (!isEnabled) {
        throw new BadRequestException('номера отключён.');
      }

      const hotel = await this.hotelModel.findById(hotelId);

      if (!hotel) {
        throw new BadRequestException('Отель с указанным ID не существует.');
      }

      const overlappingReservation = await this.reservationModel.findOne({
        roomId: roomId,
        dateStart: { $lt: dateEnd },
        dateEnd: { $gt: dateStart },
      });

      if (overlappingReservation) {
        throw new BadRequestException('Даты уже заняты для данного номера.');
      }

      const reservClient = {
        userId: id,
        hotelId,
        roomId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      };

      await this.reservationModel.create(reservClient);

      return {
        dateStart,
        dateEnd,
        hotelRoom: {
          description,
          images,
        },
        hotel: {
          title: hotel.title,
          description: hotel.description,
        },
      };
    } catch (error) {
      this.logger.error('Ошибка при бронировании номера', error.stack);
      throw error;
    }
  }

  async clientListReservations(id: Types.ObjectId): Promise<ResponseReservationDto[]> {
    try {
      const allReservations = await this.reservationModel
        .find({ userId: id })
        .populate<{ roomId: IHotelRoom }>('roomId')
        .populate<{ hotelId: IHotel }>('hotelId');

      if (!allReservations || !allReservations.length) {
        throw new BadRequestException('Пользователь с указанным id не существует');
      }

      const formattedReservations = allReservations.map((reservation) => {
        return {
          dateStart: reservation.dateStart.toISOString(),
          dateEnd: reservation.dateEnd.toISOString(),
          hotelRoom: {
            description: reservation.roomId.description,
            images: reservation.roomId.images,
          },
          hotel: {
            title: reservation.hotelId.title,
            description: reservation.hotelId.description,
          },
        };
      });

      return formattedReservations;
    } catch (error) {
      this.logger.error('Ошибка при поиске бронирований текущего клиента', error.stack);
      throw error;
    }
  }

  async clientDeleteReservation(id: string): Promise<void> {
    try {
      const clientReservation = await this.reservationModel.findByIdAndDelete(id);

      if (!clientReservation) {
        throw new BadRequestException('Бронирование с указанным id не существует');
      }
      return;
    } catch (error) {
      this.logger.error('Ошибка при удаления бронирований клиента', error.stack);
      throw error;
    }
  }
}
