import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number) // 👈 Force transformation to number
  @IsInt()
  @Min(0)
  washingtime?: number;
}
