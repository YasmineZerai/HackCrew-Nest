import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ 
    example: {
      id: 1,
      email: 'user@example.com',
      username: 'john_doe'
    },
    description: 'Basic user data'
  })
  user: {
    id: number;
    email: string;
    username: string;
  };
}
