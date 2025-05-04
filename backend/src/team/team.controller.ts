import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async createTeam(
    @GetUser() user: User,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    const team = await this.teamService.createTeam(user, createTeamDto);
    return {
      success: true,
      message: 'Team created successfully',
      payload: { team },
    };
  }

  @Post(':teamId/codes')
  async createTeamCode(@GetUser() user: User, @Param('teamId') teamId: number) {
    const code = await this.teamService.createTeamCode(teamId, user.id);
    return {
      success: true,
      message: 'Code created successfully, this code lasts one hour',
      payload: { code },
    };
  }

  @Post(':teamId/invitations')
  async inviteUser(
    @GetUser() user: User,
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

  @Get()
  async getTeams(@GetUser() user: User) {
    const teams = await this.teamService.findAll();
    return {
      success: true,
      message: 'Teams fetched successfully',
      payload: { teams },
    };
  }

  @Get(':teamId')
  async getTeam(@GetUser() user: User, @Param('teamId') teamId: number) {
    const team = await this.teamService.findOne(teamId);
    return {
      success: true,
      message: 'Team fetched successfully',
      payload: { team },
    };
  }
}
