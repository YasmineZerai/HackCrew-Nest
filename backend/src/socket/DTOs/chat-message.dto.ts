import { IsString } from 'class-validator';

export class ChatMessageDto {
  @IsString({ message: 'the message should be of type string' })
  content: string;
}
