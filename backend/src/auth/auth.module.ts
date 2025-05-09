import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './user.schema';
import { Otp, OtpSchema } from './otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerService } from 'src/common/mailer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    // Import PassportModule and register the default strategy as 'jwt'
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, MailerService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
