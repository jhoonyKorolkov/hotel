import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { AdminHotelsController } from './admin-hotels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { PublicHotelsController } from './public-hotels.controller';
import { LoggerModule } from '../common/logger/services/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      {
        name: HotelRoom.name,
        schema: HotelRoomSchema,
      },
    ]),
    LoggerModule,
  ],
  controllers: [AdminHotelsController, PublicHotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
