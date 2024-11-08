import { Test, TestingModule } from '@nestjs/testing';
import { ProductMgmtService } from './product-mgmt.service';

describe('ProductMgmtService', () => {
  let service: ProductMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMgmtService],
    }).compile();

    service = module.get<ProductMgmtService>(ProductMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
