import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Model, Types } from 'mongoose';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CustomLoggerService } from '../common/logger/services/custom-logger.service';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from '../hotels/schemas/hotel-room.schema';
import { ResponseReservationDto } from './dto/response-reservation.dto';

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
      const { hotelRoom, startDate, endDate } = data;

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
        dateStart: { $lt: endDate },
        dateEnd: { $gt: startDate },
      });

      if (overlappingReservation) {
        throw new BadRequestException('Даты уже заняты для данного номера.');
      }

      const reservClient = {
        userId: id,
        hotelId,
        roomId,
        dateStart: startDate,
        dateEnd: endDate,
      };

      await this.reservationModel.create(reservClient);

      return {
        startDate,
        endDate,
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
      this.logger.error(`error ${error}`);
      throw error;
    }
  }
}
