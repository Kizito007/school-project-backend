import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommerceAdmin, CommerceAdminDocument } from './admin.schema';
import { AddManagerDto, UpdateManagerRoleDto } from './admin-mgmt.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AdminMgmtService {
  constructor(
    @InjectModel(CommerceAdmin.name)
    private readonly adminModel: Model<CommerceAdminDocument>,
    private readonly filesService: FilesService,
  ) {}

  async getAdmins() {
    const data: any[] = await this.adminModel.find(
      {},
      {
        adminId: 1,
        username: 1,
        email: 1,
        role: 1,
        _username: 1,
        createdAt: 1,
      },
      {
        lean: true,
      },
    );

    return data;
  }

  async getAdminStats() {
    // Get the count of all admins
    const totalAdminsCount = await this.adminModel.countDocuments();

    // Get the count of admins for each role
    const result = await this.adminModel.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Create an object to store the counts
    const data = {
      SUPER_ADMIN: 0,
      EDITOR: 0,
      ARBITRATOR: 0,
    };

    result.forEach(({ _id, count }) => {
      data[_id] = count;
    });

    return {
      totalAccessManagers: totalAdminsCount,
      superAdmin: data.SUPER_ADMIN,
      editor: data.EDITOR,
      arbitrator: data.ARBITRATOR,
    };
  }

  async getAdmin(field: string, value: string) {
    return await this.adminModel.findOne({ [field]: value });
  }

  async getAdminCredential(
    field: string,
    value: string,
  ): Promise<CommerceAdmin | null | undefined> {
    return await this.adminModel.findOne(
      { [field]: value },
      {
        password: 1,
        email: 1,
        username: 1,
        adminId: 1,
        role: 1,
      },
      { lean: true },
    );
  }

  async addManager(addManagerDto: AddManagerDto, file: Express.Multer.File) {
    if (file) {
      const upload = await this.filesService.uploadFile(file);

      addManagerDto.photo = {
        content: 'profile-picture',
        size: upload.bytes,
        mimeType: file.mimetype,
        url: upload.url,
      };
    }
    return await this.adminModel.create(addManagerDto);
  }

  async updateManagerRole({ adminId, role }: UpdateManagerRoleDto) {
    return await this.adminModel.findOneAndUpdate(
      { adminId },
      {
        $set: { role },
      },
      { new: true },
    );
  }
}
