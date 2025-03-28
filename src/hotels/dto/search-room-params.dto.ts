import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchRoomParamsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @IsNotEmpty()
  @IsString()
  hotel: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isEnabled?: boolean;
}
