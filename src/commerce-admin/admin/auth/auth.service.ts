import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { KeyGen } from 'src/common/utils/key-gen';
import {
  VerifyEmail,
  VerifyEmailDocument,
} from 'src/commerce-admin/auth/verify-email.schema';
import { AdminMgmtService } from '../admin-mgmt/admin-mgmt.service';
import { MailgunService } from 'src/comms/mailgun.service';
import { NodeMailerService } from 'src/comms/nodemailer.service';
import { NotAuthorizedToPerfromActionException } from 'src/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminMgmtService: AdminMgmtService,
    private mailgunService: MailgunService,
    private nodemailerService: NodeMailerService,
    @InjectModel(VerifyEmail.name)
    private readonly verifyEmailModel: Model<VerifyEmailDocument>,
  ) {}

  async sendEmailVerificationLink(email: string) {
    try {
      const admin = await this.adminMgmtService.getAdminCredential(
        'email',
        email,
      );

      if (!admin) throw new NotFoundException('No record found!');
      const verifyToken = KeyGen.gen(6);

      await this.verifyEmailModel.findOneAndUpdate(
        { email },
        {
          userId: admin.adminId,
          email,
          token: verifyToken,
        },
        {
          upsert: true,
        },
      );
      await this.nodemailerService.sendEmail(
        admin.email,
        'OTP Verification',
        `Your One Time Password is ${verifyToken}`,
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(verifyToken: string, adminId: string) {
    try {
      const admin = await this.adminMgmtService.getAdmin('adminId', adminId);
      if (!admin) throw new NotFoundException('Admin not found!');

      const getVerifyTokenInDb = await this.verifyEmailModel.findOne({
        userId: adminId,
      });
      if (!getVerifyTokenInDb)
        throw new UnauthorizedException('Invalid or Expired Token');

      const isVerifyTokenMatch = getVerifyTokenInDb.token === verifyToken;

      if (!isVerifyTokenMatch) throw new UnauthorizedException('Invalid token');

      await this.verifyEmailModel.findOneAndDelete({ userId: adminId });

      const token = this.jwtService.sign({
        sub: admin.adminId,
        adminId: admin.adminId,
        email: admin.email,
        role: admin.role,
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async verifySecurityAnswer(securityAnswer: string, adminId: string) {
    try {
      // Ensure the answer contains "The name of"
      const lowercaseSecurityAnswer = securityAnswer.toLowerCase();
      if (
        !(
          lowercaseSecurityAnswer.startsWith('the name of') ||
          lowercaseSecurityAnswer.startsWith('the maiden name') ||
          lowercaseSecurityAnswer.startsWith('my mother’s maiden name')
        )
      ) {
        throw NotAuthorizedToPerfromActionException();
      }
      const admin = await this.adminMgmtService.getAdmin('adminId', adminId);
      if (!admin) throw new NotFoundException('Admin not found!');

      // Ensure the provided security answer contains the stored answer
      if (!lowercaseSecurityAnswer.includes(admin.securityAnswer)) {
        throw new UnauthorizedException(
          'Security answer is incorrect or does not contain the expected response.',
        );
      }

      // if (!isSecurityAnswerMatch)
      //   throw new UnauthorizedException('Answer Incorrect');

      const token = this.jwtService.sign({
        sub: admin.adminId,
        adminId: admin.adminId,
        email: admin.email,
        role: admin.role,
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async signAdminJwt(adminId: string) {
    const admin = await this.adminMgmtService.getAdmin('adminId', adminId);
    if (!admin) throw new NotFoundException('Admin not found!');

    const token = this.jwtService.sign({
      sub: admin.adminId,
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
    });

    return { token };
  }
}
