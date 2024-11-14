import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { EmployeeUser, EmployeeUserDocument } from './user-mgmt.schema';
import { AddUserDto } from 'src/commerce-admin/users/users.dto';

@Injectable()
export class UserMgmtService {
  constructor(
    @InjectModel(EmployeeUser.name)
    private readonly userModel: Model<EmployeeUserDocument>,
  ) {}

  async findUser(
    field: string,
    key: string,
  ): Promise<EmployeeUser | null | undefined> {
    try {
      const user = await this.userModel.findOne(
        { [field]: key },
        { _id: 0 },
        { lean: true },
      );

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getCredential(
    field: string,
    key: string,
  ): Promise<Partial<EmployeeUser | null>> {
    try {
      return await this.userModel.findOne(
        { [field]: key },
        {
          password: 1,
          userId: 1,
          email: 1,
          emailVerified: 1,
          securityAnswer: 1,
          username: 1,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async addUser({ ...addUserDto }: AddUserDto): Promise<EmployeeUserDocument> {
    try {
      // Check if user already exists
      const existingUser = await this.getCredential('email', addUserDto.email);
      if (existingUser?.email) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(addUserDto.password, 10);
      addUserDto.password = hashedPassword;

      const newUser = await this.userModel.create(addUserDto);
      if (!newUser?.userId) {
        throw new InternalServerErrorException('Unable to add user');
      }

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateField(
    key: string,
    value: string,
    field: string,
    value2: string | boolean | object,
  ): Promise<EmployeeUser | null | undefined> {
    try {
      return await this.userModel.findOneAndUpdate(
        { [key]: value },
        { $set: { [field]: value2 } },
        { lean: true, new: true },
      );
    } catch (error) {
      throw error;
    }
  }
}
