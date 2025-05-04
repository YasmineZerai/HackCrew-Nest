import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from './entities/team.entity';
import { Code } from './entities/code.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@src/auth/auth.module';
import { MailModule } from '@src/mail/mail.module';
import { MembershipModule } from '@src/membership/membership.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, Code]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    ConfigModule,
    AuthModule,
    MailModule,
    forwardRef(() => MembershipModule),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
