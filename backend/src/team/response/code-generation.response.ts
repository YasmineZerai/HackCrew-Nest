import { ApiProperty } from '@nestjs/swagger';
import { Code } from '../entities/code.entity';

class CodePayload {
  @ApiProperty({ type: () => Code })
  code: Code;
}
export class CreateTeamCodeResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Code generated successfully' })
  message: string;

  @ApiProperty({
    type: () => CodePayload,
  })
  payload:CodePayload
}
