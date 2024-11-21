import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure the transporter with your email service credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or use 'smtp.ethereal.email' for testing
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
      throw new Error(`Failed to send email to ${to}`);
    }
  }
}
