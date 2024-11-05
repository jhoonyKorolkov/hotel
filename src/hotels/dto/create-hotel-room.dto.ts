import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateHotelRoomDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  hotelId: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images?: string[];
}
