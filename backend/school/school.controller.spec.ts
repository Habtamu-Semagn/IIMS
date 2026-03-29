import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // FIX: Ensure this exact syntax
import { AppModule } from '../app.module';

describe('SchoolController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  const adminToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NjBhYTgyMC05YmNkLTQxMWYtYjQ0My0zMWI4YzFkYWFjYjAiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NDc0NDM5NCwiZXhwIjoxNzc0ODMwNzk0fQ.MArjhmYuMBwSxgctG9oCIhu-TBdaOtGIbcFLjBpsrfA';
  it('/schools (POST) - Admin can create school', () => {
    return request(app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New School',
        region: 'Central', // FIX: Add the missing 'region' field here
      })
      .expect(201);
  });
  afterAll(async () => {
    await app.close(); // FIX: Prevents "Force Exited" worker error
  });
});
