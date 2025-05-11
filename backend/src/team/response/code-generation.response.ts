import { ApiProperty } from '@nestjs/swagger';
import { Code } from '../entities/code.entity';

export class CreateTeamCodeResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Code generated successfully' })
  message: string;

  @ApiProperty({
    type: () => Code,
  })
  payload: {
    code: Code;
  };
}
