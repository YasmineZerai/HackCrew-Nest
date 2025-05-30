import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRessourceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  link?: string;
  @ApiProperty()
  @IsOptional()
  teamId?: number;
  // @ApiProperty()
  // @IsOptional()
  // userId?: number;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The uploaded file'})
  file : any;
}
