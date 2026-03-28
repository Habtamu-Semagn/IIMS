import { Test, TestingModule } from '@nestjs/testing';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

describe('TrainingController', () => {
  let controller: TrainingController;

  const mockService = {
    enrollTeacher: jest
      .fn()
      .mockResolvedValue({ attendance_id: 'uuid', status: 'Enrolled' }),
    recordAttendance: jest
      .fn()
      .mockResolvedValue({ attendance_id: 'uuid', status: 'Present' }),
    generateCertificate: jest
      .fn()
      .mockResolvedValue({ certificate_id: 'uuid' }),
    verifyCertificate: jest.fn().mockResolvedValue({ certificate_id: 'uuid' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [{ provide: TrainingService, useValue: mockService }],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
  });

  it('should enroll teacher', async () => {
    const res = await controller.enroll({
      teacher_id: 'uuid',
      training_id: 'uuid',
    });
    expect(res).toEqual({ attendance_id: 'uuid', status: 'Enrolled' });
  });

  it('should record attendance', async () => {
    const res = await controller.attendance({
      teacher_id: 'uuid',
      training_id: 'uuid',
      status: 'Present',
    });
    expect(res).toEqual({ attendance_id: 'uuid', status: 'Present' });
  });

  it('should generate certificate', async () => {
    const res = await controller.generateCertificate({
      teacher_id: 'uuid',
      training_id: 'uuid',
    });
    expect(res).toEqual({ certificate_id: 'uuid' });
  });

  it('should verify certificate', async () => {
    const res = await controller.verify({ hash_or_qr: 'hash' });
    expect(res).toEqual({ certificate_id: 'uuid' });
  });
});
