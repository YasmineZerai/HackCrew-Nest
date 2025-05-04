import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { MessageService } from './message.service';
import {
  CreateMessageDto,
  CreateMessageSchema,
} from '@src/core/zod-schemas/create-message.schema';
import { Request } from 'express';
import { HttpZodPipe } from '@src/core/pipes/http-zod-validation.pipes';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { User } from '@src/user/entities/user.entity';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UsePipes(new HttpZodPipe(CreateMessageSchema))
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
  }
}
