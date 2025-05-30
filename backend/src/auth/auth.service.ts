import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from '@src/core/zod-schemas/auth.schema';
import { UserResponse, LoginResponse } from './interfaces/auth.interface';
import { instanceToPlain } from 'class-transformer';
import { User } from '@src/user/entities/user.entity';
import { Inject, forwardRef } from '@nestjs/common';
import { BlacklistService } from '../blacklist/blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject(BlacklistService) private readonly blacklistService: BlacklistService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponse | null> {
    let user: User;

    try {
      user = await this.usersService.findByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      pass,
      user.password,
    );

    if (!isPasswordValid) return null;

    return instanceToPlain(user) as UserResponse;
  }
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const user = await this.usersService.create(registerDto);
    return instanceToPlain(user) as UserResponse;
  }

  async logout(token: string): Promise<void> {
    await this.blacklistService.addToken(token);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklistService.isTokenBlacklisted(token);
  }
}
