import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { ConfirmDto } from './dtos/confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto.email,signupDto.name);
  }
  @Post('confirm')
  async confirm(@Body() confirmDto: ConfirmDto) {
    return this.authService.confirm(confirmDto.email,confirmDto.otp,confirmDto.password,confirmDto.age);
  }
  
}