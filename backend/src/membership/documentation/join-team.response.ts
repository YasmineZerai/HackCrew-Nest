import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../../team/entities/team.entity';

export class JoinTeamResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Successfully joined the team' })
  message: string;

  @ApiProperty({
    type: () => Team,
    description: 'The team that the user joined',
  })
  payload: {
    team: Team;
  };
}
