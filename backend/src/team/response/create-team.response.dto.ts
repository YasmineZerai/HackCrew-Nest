import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../entities/team.entity';

class TeamPayload {
  @ApiProperty({ type: () => Team })
  team: Team;
}

export class CreateTeamResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Team created successfully' })
  message: string;

  @ApiProperty({ type: () => TeamPayload })
  payload: TeamPayload;
}
