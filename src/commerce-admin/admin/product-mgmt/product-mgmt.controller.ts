import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import {
  AddProductDto,
  UpdateProductDto,
} from 'src/commerce-admin/products/products.dto';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '../admin-mgmt/admin.enum';
import { JwtPartialAuthGuard } from '../auth/admin-jwt-partial-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ResponseMessage } from 'src/common/decorators';
import { ProductsService } from 'src/commerce-admin/products/products.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('commerce/admin/product-mgmt')
export class ProductMgmtController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Products fetched successfully')
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get('products/:productId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Product fetched successfully')
  async getProduct(@Param('productId') productId: string) {
    return await this.productsService.findProduct('productId', productId);
  }

  @Post('products')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ARBITRATOR)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Product added successfully')
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.productsService.addProduct(addProductDto, file);
  }

  @Patch('products/:productId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ARBITRATOR)
  @ResponseMessage('Product updated successfully')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId: string,
  ) {
    updateProductDto.productId = productId;
    return await this.productsService.updateProduct(updateProductDto);
  }

  @Delete(':productId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Product deleted successfully')
  async deleteProduct(@Param('productId') productId: string) {
    return await this.productsService.deleteProduct(productId);
  }
}
