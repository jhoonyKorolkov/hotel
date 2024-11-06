import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchRoomsParamsDto } from './dto/search-room-params.dto';
import { HotelsService } from './hotels.service';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';

@Controller('common')
export class PublicHotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Get('hotel-rooms')
  async search(@Query() params: SearchRoomsParamsDto) {
    return await this.hotelsService.searchHotelRooms(params);
  }

  @Get('hotel-rooms/:id')
  async searchRoomById(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.hotelsService.searchHotelRoomById(id);
  }
}
