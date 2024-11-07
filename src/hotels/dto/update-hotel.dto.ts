import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateHotelDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
