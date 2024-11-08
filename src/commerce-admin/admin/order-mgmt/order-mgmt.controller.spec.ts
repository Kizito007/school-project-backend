import { Test, TestingModule } from '@nestjs/testing';
import { OrderMgmtController } from './order-mgmt.controller';

describe('OrderMgmtController', () => {
  let controller: OrderMgmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderMgmtController],
    }).compile();

    controller = module.get<OrderMgmtController>(OrderMgmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
