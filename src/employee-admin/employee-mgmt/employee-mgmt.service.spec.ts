import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeMgmtService } from './employee-mgmt.service';

describe('EmployeeMgmtService', () => {
  let service: EmployeeMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeMgmtService],
    }).compile();

    service = module.get<EmployeeMgmtService>(EmployeeMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
