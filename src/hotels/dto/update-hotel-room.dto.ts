import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateHotelRoomDto {
  @IsOptional()
  @IsString()
  hotelId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  existingImages?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
