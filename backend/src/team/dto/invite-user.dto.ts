import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
