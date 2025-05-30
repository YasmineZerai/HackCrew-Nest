import { ApiProperty } from '@nestjs/swagger';
import { Code } from '../entities/code.entity';

export class getCodeResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Code retrieved successfully' })
  message: string;

  @ApiProperty({
    type: () => Code,
  })
  payload: {
    code: Code;
  };
}
