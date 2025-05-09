import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
  HttpCode,
  HttpStatus,
 UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpZodPipe } from '@src/core/pipes/http-zod-validation.pipes';
import {
  LoginDto,
  LoginSchema,
  RegisterDto,
  RegisterSchema,
} from '@src/core/zod-schemas/auth.schema';
import { JwtAuthGuard } from './guards/jwt.guard';

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

  // @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }
    await this.authService.logout(token);
    return { success: true, message: 'Logged out successfully', token: token };
  }
}