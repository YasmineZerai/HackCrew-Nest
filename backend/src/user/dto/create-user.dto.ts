import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ example: 'firstName' })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty({ example: 'lastName' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'test@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
