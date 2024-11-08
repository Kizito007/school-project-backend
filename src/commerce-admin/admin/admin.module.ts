import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminMgmtModule } from './admin-mgmt/admin-mgmt.module';
import { OrderMgmtModule } from './order-mgmt/order-mgmt.module';
import { ProductMgmtModule } from './product-mgmt/product-mgmt.module';

@Module({
  imports: [AuthModule, AdminMgmtModule, OrderMgmtModule, ProductMgmtModule]
})
export class AdminModule {}
