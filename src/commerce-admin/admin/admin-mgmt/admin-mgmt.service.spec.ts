import { Test, TestingModule } from '@nestjs/testing';
import { AdminMgmtService } from './admin-mgmt.service';

describe('AdminMgmtService', () => {
  let service: AdminMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminMgmtService],
    }).compile();

    service = module.get<AdminMgmtService>(AdminMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
