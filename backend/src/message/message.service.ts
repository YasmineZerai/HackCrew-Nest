<<<<<<< HEAD
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { GenericService } from '@src/common/services/generic.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '@src/user/entities/user.entity';
import { TeamService } from '@src/team/team.service';
=======
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
>>>>>>> feature/auth

@Injectable()
export class MessageService extends GenericService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
<<<<<<< HEAD
    private readonly teamService: TeamService,
  ) {
    super(messageRepository, ['sender', 'team'], 'Message');
  }

  async createMessage(
    user: User,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const team = await this.teamService.findOne(createMessageDto.teamId);
    return super.create({
      ...createMessageDto,
      sender: user,
      team: team,
    });
  }

  async getTeamMessages(user: User, teamId: number) {
    const existingTeam = await this.teamService.findOne(teamId);
    if (existingTeam) {
      const userInTeam = this.teamService.isMember(existingTeam, user.id);
      if (userInTeam) {
        return this.messageRepository.find({
          where: { team: { id: teamId } },
          relations: this.relations,
          order: { createdAt: 'DESC' },
        });
      }
    }
    throw new ForbiddenException();
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { sender: { id: userId } },
      relations: this.relations,
    });
=======
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
>>>>>>> feature/auth
  }
}
*/
