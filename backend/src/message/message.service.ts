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

@Injectable()
export class MessageService extends GenericService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
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
  }
}

