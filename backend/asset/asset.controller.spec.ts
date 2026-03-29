import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('AssetController (e2e)', () => {
  let app: INestApplication; // Declare it here

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // Initialize it here
    await app.init();
  });

  it('/assets (POST)', () => {
    return request(app.getHttpServer()) // Now 'app' exists!
      .post('/assets');
    // ... rest of your test
  });

  afterAll(async () => {
    await app.close();
  });
});
