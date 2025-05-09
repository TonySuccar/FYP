// src/users/users.controller.ts
import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './user.service';
import { GetUser, GetUser as UserDecorator } from '../auth/get-user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer.config';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@UserDecorator('userId') userId: string) {
    return this.usersService.findByUserId(userId);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto,
    @GetUser('userId') userId: string,
  ) {
    return this.usersService.updateUser(userId, body, file);
  }
  

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @GetUser('userId') userId: string,
  ) {
    const result = await this.usersService.changePassword(userId, dto);
    if (!result) {
      throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Password updated successfully' };
  }

}
