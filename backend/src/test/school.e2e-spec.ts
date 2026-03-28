import { createTestApp } from './setup';
import request from 'supertest';
describe('School E2E', () => {
  let app;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create and list schools', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/school')
      .send({
        name: 'Test School',
        region: 'Region A',
        it_coordinator: 'Jane',
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.school_id).toBeDefined();

    const listRes = await request(app.getHttpServer()).get('/school');
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBeGreaterThan(0);
  });
});
