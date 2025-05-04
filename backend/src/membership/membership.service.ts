import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { ErrorHandler } from '@src/common/utils/error-handler.util';
import { User } from '@src/user/entities/user.entity';
import { Team } from '@src/team/entities/team.entity';
import { TeamService } from '@src/team/team.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,
    @Inject(forwardRef(() => TeamService))
    private teamService: TeamService,
  ) {}

  async joinTeamByCode(user: User, code: string): Promise<Team> {
    try {
      const codeNumber = parseInt(code);
      if (isNaN(codeNumber)) {
        ErrorHandler.badRequest('Invalid code format');
      }

      const team = await this.teamService.findTeamByCode(codeNumber);

      if (!team?.code) {
        ErrorHandler.badRequest('Team code not found');
      }

      // Compare dates with proper time consideration
      const now = new Date();
      const expiresAt = new Date(team.code.expiresAt);

      if (expiresAt.getTime() <= now.getTime()) {
        ErrorHandler.badRequest('Team code has expired');
      }

      const existingMembership = team.memberships?.find(
        (m) => m.user?.id === user.id,
      );

      if (existingMembership) {
        ErrorHandler.conflict('You are already a member of this team');
      }

      await this.joinTeam(user, team);

      return team;
    } catch (error) {
      console.error('Join team error:', error);
      ErrorHandler.handleError(error);
    }
  }

  async joinTeam(user: User, team: Team): Promise<Membership> {
    try {
      const existingMembership = await this.membershipRepo.findOne({
        where: { user: { id: user.id }, team: { id: team.id } },
      });

      if (existingMembership) {
        ErrorHandler.conflict('User is already a member of this team');
      }

      const membership = this.membershipRepo.create({
        user,
        team,
      });

      return await this.membershipRepo.save(membership);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async leaveTeam(userId: number, teamId: number): Promise<void> {
    try {
      const membership = await this.membershipRepo.findOne({
        where: { user: { id: userId }, team: { id: teamId } },
        relations: ['team'],
      });

      if (!membership) {
        ErrorHandler.notFound('Membership');
      }

      await this.membershipRepo.remove(membership);

      // Check if team has any members left
      const teamMembersCount = await this.membershipRepo.count({
        where: { team: { id: teamId } },
      });

      if (teamMembersCount === 0) {
        await this.teamService.remove(teamId);
      }
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async getTeamMembers(teamId: number, userId: number) {
    try {
      const team = await this.teamService.findOne(teamId);

      if (!this.teamService.isMember(team, userId)) {
        ErrorHandler.unauthorized('Not authorized to view team members');
      }

      const memberships = await this.membershipRepo.find({
        where: { team: { id: teamId } },
        relations: ['user'],
      });

      return memberships.map((membership) => membership.user);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
