import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  AdminNotFoundException,
  LoginCredentialsException,
} from 'src/common/exceptions';
import { TokenHandler } from 'src/common/utils/token-handler';
import { JwtService } from '@nestjs/jwt';
import { AdminMgmtService } from '../admin-mgmt/admin-mgmt.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminMgmtService: AdminMgmtService,
  ) {
    super({
      usernameField: 'username',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Record<string, any>,
    username: string,
    password: string,
  ): Promise<any> {
    // const [email, deviceToken] = email.split('|');
    const admin = await this.adminMgmtService.getAdminCredential(
      '_username',
      username.toLocaleLowerCase(),
    );

    if (!admin?.adminId) {
      throw AdminNotFoundException();
    }

    if (!(await TokenHandler.verifyKey(admin!.password, password))) {
      throw LoginCredentialsException();
    }

    const payload = {
      sub: admin.adminId,
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
    };
    delete admin.password;

    return { ...admin, jwt: this.jwtService.sign(payload) };
  }
}
