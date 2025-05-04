import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpZodPipe } from '@src/core/pipes/http-zod-validation.pipes';
import {
  LoginDto,
  LoginSchema,
  RegisterDto,
  RegisterSchema,
} from '@src/core/zod-schemas/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new HttpZodPipe(LoginSchema))
  async login(@Body() loginDto: LoginDto) {
    const user = { email: loginDto.email, password: loginDto.password };
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new HttpZodPipe(RegisterSchema))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
