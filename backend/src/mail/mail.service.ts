import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { ErrorHandler } from '../common/utils/error-handler.util';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }
    SendGrid.setApiKey(apiKey);
  }

  async sendTeamInvitation(
    email: string,
    teamName: string,
    invitationLink: string,
  ): Promise<void> {
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    const fromName = this.configService.get<string>('SENDGRID_FROM_NAME');

    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL is not configured');
    }

    const mail: SendGrid.MailDataRequired = {
      to: email,
      from: {
        email: fromEmail,
        name: fromName || 'HackCrew',
      },
      subject: `HackCrew - Join ${teamName} Team`,
      templateId: 'd-3924116243dd441d8533aabfc38b6e04',
      dynamicTemplateData: {
        teamName,
        invitationLink,
        year: new Date().getFullYear(),
      },
    };

    try {
      await SendGrid.send(mail);
    } catch (error) {
      console.error('SendGrid error:', error);
      ErrorHandler.handleError(error);
    }
  }
}
