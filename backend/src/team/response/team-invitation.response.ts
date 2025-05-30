// common/dto/success-message.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class SuccessMessageResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Invitation sent successfully' })
  message: string;
}
