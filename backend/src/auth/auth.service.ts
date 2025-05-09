import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './otp.schema';
import { MailerService } from 'src/common/mailer.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(user: UserDocument): string {
    const payload = {
      userId: user._id, // Ensure it's a string
      name: user.name,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || '123',
      expiresIn: '1h',
    });
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email:normalizedEmail });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      message: 'Login successful',
      accessToken: this.generateToken(user), // ✅ Use the same function
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async signup(email: string,name: string) {
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestException('Email is already ine use.');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpModel.findOneAndUpdate(
      { email },
      { email, code: otpCode, expiresAt,name},
      { upsert: true, new: true },
    );

    const subject = `Your OTP Code is: ${otpCode}`;
    const text = `Dear ${name}, your OTP code is: ${otpCode}`;
    const html = `<p>Dear ${name}, your OTP code is: <strong>${otpCode}</strong></p>`;

    await this.mailerService.sendEmail(email, subject, text, html);

    return { message: 'OTP sent to your email.' };
  }

  async confirm(email: string, otp: string, password: string, age: number) {
    const otpEntry = await this.otpModel.findOne({ email, code: otp });

    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP.');
    }

    await this.otpModel.deleteOne({ email, code: otp });

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userid = `USER_${uuidv4()}`;

    const newUser = await this.userModel.create({
      userid,
      email,
      password: hashedPassword,
      age: age,
      name: otpEntry.name,
      profileImageUrl: null,
      washingtime: 1,
    });

    return {
      message: 'OTP verified successfully, user created.',
      user: {
        name: newUser.name,
        userid: newUser.userid,
        email: newUser.email,
        age: newUser.age,
      },
    };
  }
}
