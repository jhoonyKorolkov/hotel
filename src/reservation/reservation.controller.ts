import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DateValidationPipe } from '../common/pipes/validate-date-reservation.pipe';

@Controller('client')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('reservations')
  clientReservation(@Body(new DateValidationPipe()) data: CreateReservationDto, @Request() req) {
    return this.reservationService.clientReservation(data, req.user._id);
  }
}
