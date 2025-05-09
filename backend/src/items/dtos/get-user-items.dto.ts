// src/items/dto/get-user-items.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GetUserItemsDto {
  @IsOptional()
  @IsString()
  season?: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
