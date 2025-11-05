import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() body: { token: string }) {
    return this.authService.validateToken(body.token);
  }
}
