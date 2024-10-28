import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentMgmtService } from './department-mgmt.service';

describe('DepartmentMgmtService', () => {
  let service: DepartmentMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentMgmtService],
    }).compile();

    service = module.get<DepartmentMgmtService>(DepartmentMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
