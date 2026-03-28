import { createTestApp } from './setup';
import request from 'supertest';
describe('Auth E2E', () => {
  let app;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and login user', async () => {
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'John',
        email: 'john@test.com',
        password: '1234',
        role: 'ADMIN',
      });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user_id).toBeDefined();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'john@test.com', password: '1234' });
    expect(loginRes.status).toBe(201);
    expect(loginRes.body.access_token).toBeDefined();
  });
});
