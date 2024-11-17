import { Test, TestingModule } from '@nestjs/testing';
import { FacesService } from './faces.service';

describe('FacesService', () => {
  let service: FacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacesService],
    }).compile();

    service = module.get<FacesService>(FacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
