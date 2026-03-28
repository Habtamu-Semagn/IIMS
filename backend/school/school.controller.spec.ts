import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

describe('SchoolController', () => {
  let controller: SchoolController;

  const mockService = {
    create: jest
      .fn()
      .mockResolvedValue({ school_id: 'uuid', name: 'Test School' }),
    findAll: jest
      .fn()
      .mockResolvedValue([{ school_id: 'uuid', name: 'Test School' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [{ provide: SchoolService, useValue: mockService }],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
  });

  it('should create a school', async () => {
    const res = await controller.create({
      name: 'Test School',
      region: 'Region 1',
      it_coordinator_id: 'John',
    });
    expect(res).toEqual({ school_id: 'uuid', name: 'Test School' });
    expect(mockService.create).toHaveBeenCalled();
  });

  it('should list schools', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ school_id: 'uuid', name: 'Test School' }]);
  });
});
