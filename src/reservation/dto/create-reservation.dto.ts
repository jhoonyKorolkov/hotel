import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  hotelRoom: string;

  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd: string;
}
