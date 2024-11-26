import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SearchSupportTicketsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
