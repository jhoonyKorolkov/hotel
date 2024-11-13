import { Controller, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import mongoose from 'mongoose';

@Controller('manager')
export class ManagerReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @Get('reservations/:userId')
  clientListReservations(@Param('userId') userId: string) {
    const id = new mongoose.Types.ObjectId(userId);
    return this.reservationService.clientListReservations(id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @Delete('reservations/:userId')
  clientDeleteReservation(@Param('userId') userId: string) {
    return this.reservationService.clientDeleteReservation(userId);
  }
}
