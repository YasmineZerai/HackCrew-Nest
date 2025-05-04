import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  teamName: string;
}
