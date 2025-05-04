import { User } from '@src/user/entities/user.entity';

export interface UserResponse {
  id: number;
  email: string;
  username: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserResponse;
}

export type AuthUser = Pick<User, 'id' | 'email' | 'username'>;

export interface RequestWithUser extends Request {
  user: User;
}

export interface JwtPayload {
  sub: number;
  username: string;
}
