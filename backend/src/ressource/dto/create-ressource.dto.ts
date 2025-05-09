import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRessourceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  teamId?: number;

  @IsOptional()
  userId?: number;
}
