import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
describe('CurriculumController', () => {
  let controller: CurriculumController;

  const mockService = {
    upload: jest
      .fn()
      .mockResolvedValue({ curriculum_id: 'uuid', status: 'Pending Approval' }),
    approve: jest
      .fn()
      .mockResolvedValue({ curriculum_id: 'uuid', status: 'Approved' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurriculumController],
      providers: [{ provide: CurriculumService, useValue: mockService }],
    }).compile();

    controller = module.get<CurriculumController>(CurriculumController);
  });

  it('should upload curriculum', async () => {
    const res = await controller.upload({
      title: 'Math',
      file_path: '/math.pdf',
    });
    expect(res).toEqual({ curriculum_id: 'uuid', status: 'Pending Approval' });
  });

  it('should approve curriculum', async () => {
    const res = await controller.approve({ curriculum_id: 'uuid' });
    expect(res).toEqual({ curriculum_id: 'uuid', status: 'Approved' });
  });
});
