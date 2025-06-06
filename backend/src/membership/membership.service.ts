import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { ErrorHandler } from '@src/common/utils/error-handler.util';
import { User } from '@src/user/entities/user.entity';
import { Team } from '@src/team/entities/team.entity';
import { TeamService } from '@src/team/team.service';
import { SseService } from '@src/sse/sse.service';
import { NotificationService } from '@src/notification/notification.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BlacklistService } from '@src/blacklist/blacklist.service';
import { EventType } from '@src/enum/event-type.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,
    @Inject(forwardRef(() => TeamService))
    private teamService: TeamService,
    private sseService: SseService,
    private notificationService: NotificationService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private blacklistService: BlacklistService,
  ) {}

  async joinTeamByCode(user: User, code: string): Promise<Team> {
    try {
      const codeNumber = parseInt(code);
      if (isNaN(codeNumber)) {
        return ErrorHandler.badRequest('Invalid code format');
      }

      const team = await this.teamService.findTeamByCode(codeNumber);

      const existingMembership = team.memberships?.find(
        (m) => m.user?.id === user.id,
      );

      if (existingMembership) {
        return ErrorHandler.conflict('You are already a member of this team');
      }

      await this.joinTeam(user, team);

      this.notifyTeamAboutNewMember(team, user);

      return team;
    } catch (error) {
      return ErrorHandler.handleError(error);
    }
  }

  async joinTeamByInvitation(user: User, token: string): Promise<Team> {
    try {
      // Check if token is already blacklisted
      const isBlacklisted =
        await this.blacklistService.isTokenBlacklisted(token);

      if (isBlacklisted) {
        ErrorHandler.forbidden('This invitation has already been used');
      }

      let payload: { email: string; teamId: number };

      try {
        payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
      } catch (error) {
        ErrorHandler.forbidden('Invalid or expired invitation token');
      }

      if (!payload || !payload.email || !payload.teamId) {
        ErrorHandler.forbidden('Invalid invitation token format');
      }

      // Verify the token was issued to this user's email
      if (payload.email !== user.email) {
        ErrorHandler.forbidden(
          'This invitation was sent to a different email address',
        );
      }

      const team = await this.teamService.findOne(payload.teamId);

      const existingMembership = team.memberships?.find(
        (m) => m.user?.id === user.id,
      );

      if (existingMembership) {
        ErrorHandler.conflict('You are already a member of this team');
      }

      // Blacklist the token to prevent reuse
      await this.blacklistService.addToken(token);

      await this.joinTeam(user, team);

      this.notifyTeamAboutNewMember(team, user);

      return team;
    } catch (error) {
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
        ErrorHandler.forbidden(
          'You do not have permission to view team members',
        );
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

  private notifyTeamAboutNewMember(team: Team, newUser: User): void {
    // Get all team members' IDs except the new member
    // const memberIds = team.memberships
    //   .filter((membership) => membership.user.id !== newUser.id)
    //   .map((membership) => membership.user.id);

    // if (memberIds.length === 0) return;

    const notificationData = {
      team: {
        id: team.id,
        name: team.name,
      },
      user: newUser,
    };
    const message = `user with ID ${newUser.id} and username ${newUser.username} joined your team`;

    // // Send notifications to other team members
    // // this.sseService.notifyManyUsers(
    // //   memberIds,
    // //   notificationData,
    // //   'team-member-joined',
    // // );
    // memberIds.map(async (item) => {
    //   this.sseService.notifyUser(
    //     item,
    //     {
    //       notificationData,
    //     },
    //     'team-member-joined',
    //   );

    //   await this.notificationService.createNotification(item, message);
    // });

    return this.notificationService.notifyReceivers(
      team,
      newUser.id,
      notificationData,
      message,
      EventType.TEAM_JOIN,
    );
  }
}
