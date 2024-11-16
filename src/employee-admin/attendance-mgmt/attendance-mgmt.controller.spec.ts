import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceMgmtController } from './attedance-mgmt.controller';

describe('AttendanceMgmtController', () => {
  let controller: AttendanceMgmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceMgmtController],
    }).compile();

    controller = module.get<AttendanceMgmtController>(AttendanceMgmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
