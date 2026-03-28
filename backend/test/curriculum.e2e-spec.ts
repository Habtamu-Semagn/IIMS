import { version } from 'os';
import { createTestApp } from './setup';
import request from 'supertest';
describe('Curriculum & Notification', () => {
  let app;
  let curriculumId: string;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should upload and approve curriculum', async () => {
    const uploadRes = await request(app.getHttpServer())
      .post('/curriculum')
      .send({ title: 'Math 101', file_path: '/math101.pdf', version: '0' });
    curriculumId = uploadRes.body.curriculum_id;
    expect(uploadRes.body.status).toBe('Pending Approval');

    const approveRes = await request(app.getHttpServer())
      .patch(`/curriculum/${curriculumId}/approve`)
      .send({ admin_id: 'admin-uuid', teacher_email: 'teacher@test.com' });
    expect(approveRes.body.status).toBe('Approved');
  });
});
