import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { User } from '@src/user/entities/user.entity';
import { ZodPipe } from '@src/core/pipes/zod-validation.pipes';
import { zodPipeType } from '@src/core/enums/enum';
import { JoinTeamDto, JoinTeamSchema } from './dto/join-team.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JoinTeamResponseDto } from './documentation/join-team.response';
import { GetTeamMembersResponseDto } from './documentation/team-members.response';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')

export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('members')
  @ApiBody({schema:{
    type:'object',
    properties:{
      code:{type:'string',example:'xxx'},
    }
  }})
  @ApiResponse({type:JoinTeamResponseDto})
  async joinTeam(
    @ConnectedUser() user: User,
    @Body(new ZodPipe(JoinTeamSchema, zodPipeType.HTTP))
    joinTeamDto: JoinTeamDto,
  ) {
    const team = await this.membershipService.joinTeamByCode(
      user,
      joinTeamDto.code,
    );
    return {
      success: true,
      message: 'Successfully joined the team',
      payload: { team },
    };
  }

  @Delete('teams/:teamId/members')
  @ApiResponse({schema:{
    type:'object',
    properties:{
      success:{type:'boolean',example:true},
      message: {type:'string',example:'Successfully left the team'}


    }
  }})
  async leaveTeam(
    @ConnectedUser() user: User,
    @Param('teamId') teamId: number,
  ) {
    await this.membershipService.leaveTeam(user.id, teamId);
    return {
      success: true,
      message: 'Successfully left the team',
    };
  }

  @Get('teams/:teamId/members')
  @ApiResponse({type:GetTeamMembersResponseDto})
  async getTeamMembers(
    @ConnectedUser() user: User,
    @Param('teamId') teamId: number,
  ) {
    const members = await this.membershipService.getTeamMembers(
      teamId,
      user.id,
    );
    return {
      success: true,
      message: 'Members retrieved successfully',
      payload: { members },
    };
  }
}
