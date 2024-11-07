import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../admin-mgmt/admin.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
