import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({description:'name of the team'})
  @IsString()
  @IsNotEmpty()
  teamName: string;
}
