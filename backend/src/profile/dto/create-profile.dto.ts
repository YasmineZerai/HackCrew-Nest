import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class CreateProfileDto {
  @IsUrl()
  @IsNotEmpty()
  picture: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[\d\s-]+$/, {
    message: 'Phone number must be a valid format',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}