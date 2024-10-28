import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentMgmtController } from './department-mgmt.controller';

describe('DepartmentMgmtController', () => {
  let controller: DepartmentMgmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentMgmtController],
    }).compile();

    controller = module.get<DepartmentMgmtController>(DepartmentMgmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
