import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';
import { AddUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findUser(field: string, key: string): Promise<User | null | undefined> {
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

  async getUsers() {
    try {
      const users = await this.userModel.find({});
      const totalUsersCount = await this.userModel.countDocuments();

      return { users, totalUsersCount };
    } catch (error) {
      throw error;
    }
  }

  async getCredential(
    field: string,
    key: string,
  ): Promise<Partial<User | null>> {
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

  async addUser({ ...addUserDto }: AddUserDto): Promise<UserDocument> {
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
  ): Promise<User | null | undefined> {
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
