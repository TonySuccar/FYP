import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Max,
    Min,
    IsNumber,
  } from 'class-validator';
  
  export class ConfirmDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    otp: string;
  
    @IsNotEmpty()
    @MinLength(8)
    password: string;
  
    @IsNumber()
    @IsNotEmpty()
    age: number;
  }
  