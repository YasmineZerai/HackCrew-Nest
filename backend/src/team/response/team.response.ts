import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../entities/team.entity';

export class TeamResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Team fetched successfully' })
  message: string;

  @ApiProperty({
    type: () => Team,
  })
  payload: {
    team: Team ;
  };
}
