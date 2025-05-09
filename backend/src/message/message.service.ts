/*
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

import { User } from '../user/entities/user.entity';
import { CreateMessageDto } from '@src/core/zod-schemas/create-message.schema';
// import { TeamService } from '../team/team.service';


import { User } from '../user/entities/user.entity';
import { TeamService } from '../team/team.service';
import { ErrorHandler } from '../common/utils/error-handler.util';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    // private readonly teamService: TeamService,
  ) {}

  async createMessage(sender: User, createMessageDto: CreateMessageDto) {
    // const team = await this.teamService.findOne(createMessageDto.teamId);
    // const message = this.messageRepository.create({
    //   content: createMessageDto.content,
    //   sender,
    //   team,
    // });
    // return await this.messageRepository.save(message);

 
    try {
      const team = await this.teamService.findOne(createMessageDto.teamId);
      const message = this.messageRepository.create({
        content: createMessageDto.content,
        sender,
        team,
      });

      return await this.messageRepository.save(message);
    } catch (error) {
      ErrorHandler.handleError(error);
    }


  async getTeamMessages(teamId: number): Promise<Message[]> {
    try {
      return await this.messageRepository.find({
        where: { team: { id: teamId } },
        relations: ['sender', 'team'],
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  mapToResponseDto(message: Message): Promise<MessageResponseDto> {
    if (!message.sender || !message.team) {
      ErrorHandler.badRequest('Invalid message data');
    }

    const responseDto = new MessageResponseDto();
    responseDto.id = message.id;
    responseDto.content = message.content;
    responseDto.senderId = message.sender.id;
    responseDto.senderUsername = message.sender.username;
    responseDto.teamId = message.team.id;
    responseDto.createdAt = message.createdAt;
    responseDto.updatedAt = message.updatedAt;

    return Promise.resolve(responseDto);
  }
}
*/
