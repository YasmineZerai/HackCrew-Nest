import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import {
  CreateMessageDto,
  CreateMessageSchema,
} from '@src/core/zod-schemas/create-message.schema';
import { MessageResponseDto } from './dto/message-response.dto';
import { HttpZodPipe } from '@src/core/pipes/http-zod-validation.pipes';
import { User } from '../user/entities/user.entity';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UsePipes(new HttpZodPipe(CreateMessageSchema))
  async create(
    @ConnectedUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const message = await this.messageService.createMessage(
      user,
      createMessageDto,
    );
    return this.messageService.mapToResponseDto(message);
  }

  @Get('team/:teamId')
  async getTeamMessages(
    @Param('teamId') teamId: number,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.messageService.getTeamMessages(teamId);
    return Promise.all(
      messages.map((message) => this.messageService.mapToResponseDto(message)),
    );
  }
}
