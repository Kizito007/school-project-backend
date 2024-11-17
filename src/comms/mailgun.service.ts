import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';

@Injectable()
export class MailgunService {
  private mailgunClient: any;

  constructor(private readonly configService: ConfigService) {
    const mailgun = new Mailgun(formData);
    const apiKey = this.configService.get<string>('MAILGUN_API_KEY');
    this.mailgunClient = mailgun.client({
      username: 'api',
      key: apiKey,
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const domain = this.configService.get<string>('MAILGUN_DOMAIN');
    const from = this.configService.get<string>('MAILGUN_FROM_EMAIL');

    const message = {
      from,
      to,
      subject,
      text: content,
      html: `<p>${content}</p>`,
    };

    try {
      const response = await this.mailgunClient.messages.create(
        domain,
        message,
      );

      return response;
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.message);
    }
  }
}
