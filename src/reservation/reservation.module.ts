import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { PublicReservationController } from './public-reservation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { LoggerModule } from '../common/logger/services/logger.module';
import { Hotel, HotelSchema } from '../hotels/schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from '../hotels/schemas/hotel-room.schema';
import { ManagerReservationController } from './manager-reservation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: Hotel.name, schema: HotelSchema },
      {
        name: HotelRoom.name,
        schema: HotelRoomSchema,
      },
    ]),
    LoggerModule,
  ],
  controllers: [PublicReservationController, ManagerReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
