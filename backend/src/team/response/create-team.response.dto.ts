// create-team.response.ts
import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../entities/team.entity';

export class CreateTeamResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Team created successfully' })
  message: string;

  @ApiProperty({ type: Team })
  payload: {
    team: Team;
  };
}
