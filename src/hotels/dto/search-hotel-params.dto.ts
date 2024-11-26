import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchHotelParamsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsString()
  title?: string;
}
