import {
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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
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
      throw new UnauthorizedException('Invalid credentials');
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
}
