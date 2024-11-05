import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/admin/hotels')
  createHotel(@Body() hotel: CreateHotelDto) {
    return this.hotelsService.createHotel(hotel);
  }
}
