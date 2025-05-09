import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByUserId(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).select('-password');
    
  }

  async updateUser(userId: string, dto: UpdateUserDto, file?: Express.Multer.File) {
    const updatePayload: any = {};
  
    if (dto.name) updatePayload.name = dto.name;
    if (dto.washingtime !== undefined) updatePayload.washingtime = dto.washingtime;
    if (file) updatePayload.profileImageUrl = file.path;
  
    if (Object.keys(updatePayload).length === 0) {
      throw new NotFoundException('No valid fields provided for update.');
    }
  
    const updated = await this.userModel.findByIdAndUpdate(userId, updatePayload, {
      new: true,
    });
  
    if (!updated) throw new NotFoundException('User not found');
  
    return {
      message: 'User updated successfully',
      name: updated.name,
      profileImageUrl: updated.profileImageUrl,
      washingtime: updated.washingtime,
    };
  }
  

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) return false;

    const hashedNew = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedNew;
    await user.save();
    return true;
  }
}
