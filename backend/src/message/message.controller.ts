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
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateMessageDto,
  CreateMessageSchema,
} from '@src/core/zod-schemas/create-message.schema';
import { Request } from 'express';
import { HttpZodPipe } from '@src/core/pipes/http-zod-validation.pipes';

@Controller('messages')
// @UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UsePipes(new HttpZodPipe(CreateMessageSchema))
  async create(
    @Use() req: Request,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const message = await this.messageService.createMessage(
      req.user,
      createMessageDto,
    );
    return;
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
