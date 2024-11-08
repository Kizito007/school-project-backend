import { Test, TestingModule } from '@nestjs/testing';
import { OrderMgmtService } from './order-mgmt.service';

describe('OrderMgmtService', () => {
  let service: OrderMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderMgmtService],
    }).compile();

    service = module.get<OrderMgmtService>(OrderMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
