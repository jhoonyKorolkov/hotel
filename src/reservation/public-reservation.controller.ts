import { Body, Controller, Post, UseGuards, Request, Get, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DateValidationPipe } from '../common/pipes/validate-date-reservation.pipe';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';

@Controller('client')
export class PublicReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('reservations')
  clientReservation(@Body(new DateValidationPipe()) data: CreateReservationDto, @Request() req) {
    return this.reservationService.clientReservation(data, req.user._id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('reservations')
  clientListReservations(@Request() req) {
    return this.reservationService.clientListReservations(req.user._id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Delete('reservations/:id')
  clientDeleteReservations(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reservationService.clientDeleteReservation(id);
  }
}
