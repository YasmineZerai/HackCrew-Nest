import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TeamModule } from '@src/team/team.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    forwardRef(() => TeamModule),
  ],
  providers: [MembershipService],
  controllers: [MembershipController],
  exports: [MembershipService],
})
export class MembershipModule {}
