import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  hotelRoom: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
