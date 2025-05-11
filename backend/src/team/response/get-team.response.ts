import { ApiProperty } from '@nestjs/swagger';
import { Code } from '../entities/code.entity';
import { Team } from '../entities/team.entity';

export class getTeamResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Teams fetched successfully' })
  message: string;

  @ApiProperty({
    type: () => [Team],
  })
  payload: {
    teams: Team [];
  };
}
