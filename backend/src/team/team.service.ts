import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Code } from './entities/code.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { GenericService } from '@src/common/services/generic.service';
import { ErrorHandler } from '@src/common/utils/error-handler.util';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/user/entities/user.entity';
import { Membership } from '@src/membership/entities/membership.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TeamService extends GenericService<Team> {
  constructor(
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
    @InjectRepository(Code)
    private codeRepo: Repository<Code>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    super(teamRepo, ['memberships', 'memberships.user', 'code'], 'Team');
  }

  async createTeam(creator: User, createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      // Start a transaction to ensure both operations succeed or fail together
      const queryRunner = this.teamRepo.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Create the team
        const team = await queryRunner.manager.save(Team, {
          name: createTeamDto.teamName,
        });

        // Create membership for creator
        await queryRunner.manager.save(Membership, {
          user: creator,
          team: team,
        });

        // Commit transaction
        await queryRunner.commitTransaction();

        // Fetch the complete team with memberships
        return await this.findOne(team.id);
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
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

      // Generate a numeric code between 100000 and 999999
      const codeId = Math.floor(100000 + Math.random() * 900000);

      // Set expiration to exactly 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const code = this.codeRepo.create({
        id: codeId,
        expiresAt,
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

  async getTeamCode(teamId: number, userId: number): Promise<Code> {
    try {
      const team = await this.findOne(teamId);

      if (!this.isMember(team, userId)) {
        ErrorHandler.unauthorized('Not authorized to view this team code');
      }

      if (!team.code) {
        ErrorHandler.notFound('No code found for this team');
      }

      return team.code;
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
        { email, teamId },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '24h',
        },
      );

      const clientUrl = this.configService.get<string>('CLIENT_URL');
      if (!clientUrl) {
        ErrorHandler.internalServerError('CLIENT_URL not configured');
      }

      const invitationLink = `${clientUrl}/join-team?token=${token}`;

      try {
        await this.mailService.sendTeamInvitation(
          email,
          team.name,
          invitationLink,
        );
      } catch (error) {
        console.error('Failed to send invitation email:', error);
        ErrorHandler.internalServerError('Failed to send invitation email');
      }
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async findOneBy(
    where: FindOptionsWhere<Team>,
    relations?: string[],
  ): Promise<Team> {
    try {
      const team = await this.teamRepo.findOne({
        where,
        relations: relations || this.relations,
      });

      if (!team) {
        ErrorHandler.notFound('Team');
      }

      return instanceToPlain(team, { excludeExtraneousValues: true }) as Team;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async remove(id: number): Promise<Team> {
    try {
      const team = await this.findOne(id);
      await this.teamRepo.remove(team);
      return team;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  isMember(team: Team, userId: number): boolean {
    return team.memberships.some((membership) => membership.user.id === userId);
  }

  async findTeamByCode(code: number): Promise<Team> {
    try {
      const team = await this.teamRepo.findOne({
        where: {
          code: {
            id: code,
          },
        },
        relations: ['code', 'memberships', 'memberships.user'],
      });

      if (!team) {
        ErrorHandler.notFound('Team with this code');
      }

      return team;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
