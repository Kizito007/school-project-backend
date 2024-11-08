import { Test, TestingModule } from '@nestjs/testing';
import { ProductMgmtController } from './product-mgmt.controller';

describe('ProductMgmtController', () => {
  let controller: ProductMgmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductMgmtController],
    }).compile();

    controller = module.get<ProductMgmtController>(ProductMgmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
