/*
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
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { User } from '@src/user/entities/user.entity';
<<<<<<< HEAD
=======

>>>>>>> feature/auth

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UsePipes(new HttpZodPipe(CreateMessageSchema))
<<<<<<< HEAD
  async create(@Body() createMessageDto, @ConnectedUser() user: User) {
    const message = await this.messageService.createMessage(
      user,
      createMessageDto.data,
    );

    return {
      success: true,
      message: 'message created successfully',
      payload: message,
    };
  }

  @Get('teams/:teamId')
  async getTeamMessages(
    @Param('teamId') teamId: number,
    @ConnectedUser() user: User,
  ) {
    const messages = await this.messageService.getTeamMessages(user, teamId);
    return {
      success: true,
      message: 'messages fetched successfully',
      payload: messages,
    };
=======
  async create(
    @ConnectedUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.messageService.createMessage(
      user,
      createMessageDto,
    );

    return message;

  }

  @Get('team/:teamId')
  async getTeamMessages(@Param('teamId') teamId: number) {
    const messages = await this.messageService.getTeamMessages(teamId);
    return messages;
>>>>>>> feature/auth
  }
}
*/
