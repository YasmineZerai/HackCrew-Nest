import { ISendMailOptions } from '@nestjs-modules/mailer';

export interface TeamInvitationContext {
  teamName: string;
  invitationLink: string;
  year: number;
}

export interface TeamInvitationOptions extends ISendMailOptions {
  context: TeamInvitationContext;
}
