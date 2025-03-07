import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { KeyGen } from 'src/common/utils/key-gen';
import { User, UserDocument } from '../users/users.schema';
import * as bcrypt from 'bcrypt';
import { VerifyEmail, VerifyEmailDocument } from './verify-email.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AddUserDto } from '../users/users.dto';
import { MailgunService } from 'src/comms/mailgun.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private mailgunService: MailgunService,
    private filesService: FilesService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(VerifyEmail.name)
    private readonly verifyEmailModel: Model<VerifyEmailDocument>,
  ) {}

  async validateUser(userId: string): Promise<User> {
    try {
      const user = await this.usersService.findUser('userId', userId);

      if (!user) throw new NotFoundException('Record Not found');

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'A server error has occurred',
        error.message,
      );
    }
  }

  async registerUser(
    addUserDto: AddUserDto,
    file: Express.Multer.File,
  ): Promise<{ token: string }> {
    try {
      if (file) {
        const upload = await this.filesService.uploadFile(file);

        addUserDto.photo = {
          content: upload.public_id,
          size: upload.bytes,
          mimeType: file.mimetype,
          url: upload.url,
        };
      }
      const newUser = await this.usersService.addUser(addUserDto);

      //   await this.sendEmailVerificationLink(newUser.email);
      const token = this.jwtService.sign({ userId: newUser.userId });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const user = await this.usersService.getCredential('email', email);

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          throw new UnauthorizedException('Invalid Credentials');
        }
      }

      const token = this.jwtService.sign({
        userId: user.userId,
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async sendEmailVerificationLink(email: string) {
    try {
      const user = await this.usersService.getCredential('email', email);

      if (!user) throw new NotFoundException('No record found!');
      // if (user.emailVerified)
      //   throw new BadRequestException(
      //     'This email is already verified! If you have forgotten your password please reset it.',
      //   );

      const verifyToken = KeyGen.gen(6);

      await this.verifyEmailModel.findOneAndUpdate(
        { email },
        {
          userId: user.userId,
          email,
          token: verifyToken,
        },
        {
          upsert: true,
        },
      );
      await this.mailgunService.sendEmail(
        user.email,
        'OTP Verification',
        `Your One Time Password is ${verifyToken}`,
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(verifyToken: string, userId: string) {
    try {
      const user = await this.usersService.findUser('userId', userId);
      if (!user) throw new NotFoundException('User not found!');
      // if (user.emailVerified)
      //   throw new BadRequestException('Email is already verified');

      const getVerifyTokenInDb = await this.verifyEmailModel.findOne({
        userId,
      });
      if (!getVerifyTokenInDb)
        throw new UnauthorizedException('Invalid or Expired Token');

      const isVerifyTokenMatch = getVerifyTokenInDb.token === verifyToken;

      if (!isVerifyTokenMatch) throw new UnauthorizedException('Invalid token');

      // await this.usersService.updateField(
      //   'userId',
      //   userId,
      //   'emailVerified',
      //   true,
      // );

      await this.verifyEmailModel.findOneAndDelete({ userId });

      const token = this.jwtService.sign({
        userId: user.userId,
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }
}
