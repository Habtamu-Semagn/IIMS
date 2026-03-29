import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';

describe('CurriculumController', () => {
  let controller: CurriculumController;
  let service: CurriculumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurriculumController],
      providers: [
        {
          provide: CurriculumService,
          // FIX: Mock 'create' instead of 'upload'
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue({ id: '123', title: 'Test Curriculum' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CurriculumController>(CurriculumController);
    service = module.get<CurriculumService>(CurriculumService);
  });

  it('should create curriculum successfully', async () => {
    const dto = { title: 'Test Curriculum' };
    // FIX: call controller.create()
    const result = await controller.create(dto as any);

    expect(result).toEqual({ id: '123', title: 'Test Curriculum' });
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
