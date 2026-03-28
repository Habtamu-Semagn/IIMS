import { createTestApp } from './setup';
import request from 'supertest';
describe('Training & Certificate', () => {
  let app;
  let trainingId: string;
  let certificateId: string;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;

    // Create training
    const trainingRes = await request(app.getHttpServer())
      .post('/training')
      .send({ title: 'Tech Training', date: new Date() });
    trainingId = trainingRes.body.training_id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should enroll teacher and generate certificate', async () => {
    const enrollRes = await request(app.getHttpServer())
      .post('/training/enroll')
      .send({ teacher_id: 'teacher-uuid', training_id: trainingId });
    expect(enrollRes.body.status).toBe('Enrolled');

    const certRes = await request(app.getHttpServer())
      .post('/training/certificate')
      .send({ teacher_id: 'teacher-uuid', training_id: trainingId });
    certificateId = certRes.body.certificate_id;
    expect(certificateId).toBeDefined();

    const verifyRes = await request(app.getHttpServer())
      .post('/training/certificate/verify')
      .send({ hash_or_qr: certificateId });
    expect(verifyRes.body.certificate_id).toBe(certificateId);
  });
});
