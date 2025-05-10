import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TeamModule } from '@src/team/team.module';
import { SseModule } from '@src/sse/sse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    forwardRef(() => TeamModule),
    SseModule,
  ],
  providers: [MembershipService],
  controllers: [MembershipController],
  exports: [MembershipService],
})
export class MembershipModule {}
