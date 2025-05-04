import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { CreateMessageDto } from '@src/core/zod-schemas/create-message.schema';
// import { TeamService } from '../team/team.service';

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
  }

  async getTeamMessages(teamId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { team: { id: teamId } },
      relations: ['sender', 'team'],
      order: { createdAt: 'ASC' },
    });
  }
}
