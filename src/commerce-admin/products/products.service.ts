import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { AddProductDto, UpdateProductDto } from './products.dto';
import { ProductNotFoundException } from 'src/common/exceptions';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private filesService: FilesService,
  ) {}

  async findProduct(
    field: string,
    key: string,
  ): Promise<Product | null | undefined> {
    try {
      const product = await this.productModel.findOne(
        { [field]: key },
        { _id: 0 },
        { lean: true },
      );
      if (!product) throw ProductNotFoundException();

      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await this.productModel.find({});
      const totalProductsCount = await this.productModel.countDocuments();

      return { products, totalProductsCount };
    } catch (error) {
      throw error;
    }
  }

  async addProduct(
    { ...addProductDto }: AddProductDto,
    file: Express.Multer.File,
  ): Promise<ProductDocument> {
    try {
      if (file) {
        const upload = await this.filesService.uploadFile(file);

        addProductDto.photo = {
          content: 'product-picture',
          size: upload.bytes,
          mimeType: file.mimetype,
          url: upload.url,
        };
      }
      const newProduct = await this.productModel.create(addProductDto);
      if (!newProduct?.productId) {
        throw new InternalServerErrorException('Unable to add product');
      }

      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct({ ...updateProductDto }: UpdateProductDto) {
    try {
      const productId = updateProductDto.productId;
      const product = await this.findProduct('productId', productId);

      if (!product) {
        throw ProductNotFoundException();
      }

      return await this.productModel.findOneAndUpdate(
        { productId },
        { $set: updateProductDto },
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }
}
