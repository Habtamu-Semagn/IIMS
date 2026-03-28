import { createTestApp } from './setup';
import request from 'supertest';
describe('Asset & Ticket Flow', () => {
  let app;
  let schoolId: string;
  let assetId: string;
  let ticketId: string;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;

    // Create school
    const schoolRes = await request(app.getHttpServer())
      .post('/school')
      .send({ name: 'School 1', region: 'R1', it_coordinator: 'Alice' });
    schoolId = schoolRes.body.school_id;

    // Create asset
    const assetRes = await request(app.getHttpServer()).post('/asset').send({
      name: 'Laptop',
      type: 'Hardware',
      status: 'New',
      school_id: schoolId,
    });
    assetId = assetRes.body.asset_id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create ticket and update status', async () => {
    const ticketRes = await request(app.getHttpServer())
      .post('/ticket')
      .send({ asset_id: assetId, issue_description: 'Not working' });
    ticketId = ticketRes.body.ticket_id;
    expect(ticketRes.body.status).toBe('Open');

    const updateRes = await request(app.getHttpServer())
      .patch(`/ticket/${ticketId}/status`)
      .send({ status: 'Resolved' });
    expect(updateRes.body.status).toBe('Resolved');
  });
});
