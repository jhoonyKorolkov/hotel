import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from '../../reservation/dto/create-reservation.dto';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: CreateReservationDto) {
    const { startDate, endDate } = value;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Некорректный формат даты.');
    }

    if (start >= end) {
      throw new BadRequestException('Дата начала должна быть раньше даты окончания.');
    }

    if (start < now) {
      throw new BadRequestException('Дата начала не может быть в прошлом.');
    }

    value.startDate = start.toString();
    value.endDate = end.toString();

    return value;
  }
}
