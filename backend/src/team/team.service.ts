import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Code } from './entities/code.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { GenericService } from '../common/services/generic.service';
import { ErrorHandler } from '../common/utils/error-handler.util';
import { nanoid } from 'nanoid';
import { JwtService } from '@nestjs/jwt';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TeamService extends GenericService<Team> {
  constructor(
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
    @InjectRepository(Code)
    private codeRepo: Repository<Code>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    super(teamRepo, ['memberships', 'memberships.user', 'code'], 'Team');
  }

  async createTeam(creator: User, createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const team = await this.create({
        name: createTeamDto.teamName,
        memberships: [{ user: creator }],
      });
      return team;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async createTeamCode(teamId: number, userId: number): Promise<Code> {
    try {
      const team = await this.findOne(teamId);

      if (!this.isMember(team, userId)) {
        ErrorHandler.unauthorized(
          'Not authorized to create code for this team',
        );
      }

      if (team.code) {
        ErrorHandler.conflict('Team already has a code');
      }

      const code = this.codeRepo.create({
        id: parseInt(nanoid(6).toUpperCase()),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        team,
      });

      return await this.codeRepo.save(code);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async getTeamsByUserId(userId: number): Promise<Team[]> {
    try {
      return await this.teamRepo.find({
        where: { memberships: { user: { id: userId } } },
        relations: this.relations,
      });
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async getTeamMembers(teamId: number, userId: number) {
    try {
      const team = await this.findOne(teamId);

      if (!this.isMember(team, userId)) {
        ErrorHandler.unauthorized('Not authorized to view team members');
      }

      return team.memberships.map((membership) => membership.user);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async inviteUserToTeam(
    inviterId: number,
    teamId: number,
    email: string,
  ): Promise<void> {
    try {
      const team = await this.findOne(teamId);
      if (!this.isMember(team, inviterId)) {
        ErrorHandler.unauthorized('Not authorized to invite to this team');
      }

      const token = this.jwtService.sign(
        {
          email,
          teamId,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const clientUrl = this.configService.get<string>('CLIENT_URL');
      if (!clientUrl) {
        ErrorHandler.internalServerError('CLIENT_URL not configured');
      }

      const invitationLink = `${clientUrl}/join-team?token=${token}`;

      const mailOptions: ISendMailOptions = {
        to: email,
        from: this.configService.get<string>('SMTP_FROM'),
        subject: `Join ${team.name} on HackCrew`,
        template: 'team-invitation',
        context: {
          teamName: team.name,
          invitationLink,
          year: new Date().getFullYear(),
        },
      };

      await this.mailerService.sendMail(mailOptions).catch((error) => {
        console.error('Failed to send invitation email:', error);
        ErrorHandler.internalServerError('Failed to send invitation email');
      });
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  private isMember(team: Team, userId: number): boolean {
    return team.memberships.some((membership) => membership.user.id === userId);
  }
}
