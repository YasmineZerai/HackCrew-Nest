import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class GetTeamMembersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Members retrieved successfully' })
  message: string;

  @ApiProperty({
    description: 'List of team members',
    type: () => [User],
  })
  payload: {
    members: User[];
  };
}
