import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { User } from '../user/entities/user.entity';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async createTeam(
    @ConnectedUser() user: User,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    const team = await this.teamService.createTeam(user, createTeamDto);
    return {
      success: true,
      message: 'Team created successfully',
      payload: { team },
    };
  }

  @Post(':teamId/invitations')
  async inviteUser(
    @ConnectedUser() user: User,
    @Param('teamId') teamId: number,
    @Body() inviteUserDto: InviteUserDto,
  ) {
    await this.teamService.inviteUserToTeam(
      user.id,
      teamId,
      inviteUserDto.email,
    );
    return {
      success: true,
      message: 'Invitation sent successfully',
    };
  }

  @Post(':teamId/codes')
  async createTeamCode(
    @ConnectedUser() user: User,
    @Param('teamId') teamId: number,
  ) {
    const code = await this.teamService.createTeamCode(teamId, user.id);
    return {
      success: true,
      message: 'Code generated successfully',
      payload: { code },
    };
  }

  @Get(':teamId/codes')
  async getTeamCode(
    @ConnectedUser() user: User,
    @Param('teamId') teamId: number,
  ) {
    const code = await this.teamService.getTeamCode(teamId, user.id);
    return {
      success: true,
      message: 'Code retrieved successfully',
      payload: { code },
    };
  }

  @Get()
  async getTeams(@ConnectedUser() user: User) {
    const teams = await this.teamService.getTeamsByUserId(user.id);
    return {
      success: true,
      message: 'Teams fetched successfully',
      payload: { teams },
    };
  }

  @Get(':teamId')
  async getTeam(@ConnectedUser() user: User, @Param('teamId') teamId: number) {
    const team = await this.teamService.findOne(teamId);
    if (!team) {
      return {
        success: false,
        message: 'Team not found',
      };
    }
    return {
      success: true,
      message: 'Team fetched successfully',
      payload: { team },
    };
  }
}
