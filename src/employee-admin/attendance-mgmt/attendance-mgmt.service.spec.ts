import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceMgmtService } from './attendance-mgmt.service';

describe('AttendanceMgmtService', () => {
  let service: AttendanceMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceMgmtService],
    }).compile();

    service = module.get<AttendanceMgmtService>(AttendanceMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
