import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CommerceUser, CommerceUserDocument } from './users.schema';
import { AddUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(CommerceUser.name)
    private readonly userModel: Model<CommerceUserDocument>,
  ) {}

  async findUser(
    field: string,
    key: string,
  ): Promise<CommerceUser | null | undefined> {
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
  ): Promise<Partial<CommerceUser | null>> {
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

  async addUser({ ...addUserDto }: AddUserDto): Promise<CommerceUserDocument> {
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

  //   async updateUser({ ...updateUserDto }: UpdateUserDto) {
  //     try {
  //       const userId = updateUserDto.userId;
  //       const user = await this.findUser('userId', userId);
  //       await this.checkIfActive(userId);
  //       if (!user) {
  //         throw UserNotFoundException(this.i18n);
  //       }
  //       if (updateUserDto.residence) {
  //         const { residence } = updateUserDto;
  //         updateUserDto.residence = { ...user.residence, ...residence };
  //       }
  //       if (updateUserDto.location) {
  //         if (
  //           !Array.isArray(updateUserDto.location.coordinates) ||
  //           updateUserDto.location.coordinates.length !== 2 ||
  //           updateUserDto.location.coordinates.some(
  //             (coord) => !Number.isFinite(coord),
  //           )
  //         ) {
  //           throw InvalidCoordinatesException(this.i18n);
  //         }
  //       }

  //       if (
  //         user.accountType === AccountType.ENTERTAINER &&
  //         updateUserDto.services &&
  //         !user.isProfileSetupComplete
  //       ) {
  //         const countryCurrencyMap = {
  //           [Country.NO]: Currency.Krona,
  //           [Country.NG]: Currency.Naira,
  //         };

  //         const currency = countryCurrencyMap[user.country];
  //         if (!currency) {
  //           throw UnSupportedCountryException(this.i18n);
  //         }

  //         updateUserDto.services.currency = currency;
  //         await this.walletService.createWallet({
  //           userId,
  //           currency,
  //         });
  //       }

  //       if (
  //         user.accountType === AccountType.ENTERTAINER &&
  //         updateUserDto.services
  //       ) {
  //         const { services } = updateUserDto;
  //         const validCategories = Object.values(EntertainerCategories);

  //         if (!validCategories.includes(services.category)) {
  //           throw InvalidCategoryException(this.i18n);
  //         }

  //         services.category = this.i18n.t(
  //           `test.categories.${services.category}`,
  //           {
  //             lang: 'en',
  //           },
  //         );
  //         updateUserDto.services = {
  //           ...user.services,
  //           ...services,
  //         };
  //       } else {
  //         delete updateUserDto.services;
  //       }

  //       if (updateUserDto.entertainerName) {
  //         const existingUserName = await this.getCredential(
  //           'entertainerName',
  //           updateUserDto.entertainerName,
  //         );
  //         if (
  //           existingUserName?.entertainerName &&
  //           existingUserName.userId !== userId
  //         ) {
  //           throw ExistingEntertainerNameException(this.i18n);
  //         }
  //       }

  //       return await this.userModel.findOneAndUpdate(
  //         { userId },
  //         { $set: updateUserDto },
  //         { new: true },
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async updateField(
  //     key: string,
  //     value: string,
  //     field: string,
  //     value2: string | boolean | object,
  //   ): Promise<User | null | undefined> {
  //     try {
  //       return await this.userModel.findOneAndUpdate(
  //         { [key]: value },
  //         { $set: { [field]: value2 } },
  //         { lean: true, new: true },
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
