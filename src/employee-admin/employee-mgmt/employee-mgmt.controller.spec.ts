import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeMgmtController } from './employee-mgmt.controller';

describe('EmployeeMgmtController', () => {
  let controller: EmployeeMgmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeMgmtController],
    }).compile();

    controller = module.get<EmployeeMgmtController>(EmployeeMgmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
