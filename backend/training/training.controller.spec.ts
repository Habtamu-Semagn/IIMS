import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { TrainingService } from './training.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('TrainingController (e2e)', () => {
  let app: INestApplication;

  // 1. Mock the Service to isolate Controller logic
  const mockTrainingService = {
    enrollTeacher: jest
      .fn()
      .mockResolvedValue({ success: true, message: 'Enrolled' }),
    recordAttendance: jest
      .fn()
      .mockResolvedValue({ success: true, message: 'Attendance Recorded' }),
    verifyCertificate: jest
      .fn()
      .mockResolvedValue({ valid: true, owner: 'John Doe' }),
    findAllCertificates: jest.fn().mockResolvedValue([]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TrainingService)
      .useValue(mockTrainingService)
      // 2. We keep the Guards but can override them if we want to test
      // the @Public() decorator specifically.
      .compile();

    app = moduleFixture.createNestApplication();

    // IMPORTANT: Check your main.ts. If you have app.setGlobalPrefix('api'),
    // you MUST uncomment the line below for the tests to match!
    // app.setGlobalPrefix('api');

    await app.init();
  });

  describe('/training/certificate/verify (POST)', () => {
    it('should verify a certificate without authentication (@Public)', () => {
      return request(app.getHttpServer())
        .post('/training/certificate/verify') // Ensure this matches your Prefix
        .send({ hash_or_qr: 'valid-hash-123' })
        .expect(201)
        .expect((res) => {
          expect(res.body.valid).toBe(true);
        });
    });
  });

  describe('/training/enroll (POST)', () => {
    it('should return 401 for enrollment without a token', () => {
      return request(app.getHttpServer())
        .post('/training/enroll')
        .send({ trainingId: '123' })
        .expect(401);
    });
  });

  // 3. Proper Teardown to fix "Worker process failed to exit"
  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
