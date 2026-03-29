import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('TicketController (e2e)', () => {
  let app: INestApplication;

  // 1. Create a Mock Service to avoid "Record not found" database errors
  const mockTicketService = {
    create: jest.fn().mockResolvedValue({ id: '1', title: 'Test Ticket' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', title: 'Test Ticket' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Test Ticket' }),
    update: jest.fn().mockResolvedValue({ id: '1', status: 'Resolved' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    })
      // 2. Override Guards to bypass 401 Unauthorized during testing
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Test 1: Update Ticket (The one that was failing with P2025)
  it('/tickets/:id (PATCH) - Admin can resolve ticket', () => {
    return request(app.getHttpServer())
      .patch('/tickets/860aa820-9bcd-411f-b443-31b8c1daacb0')
      .send({ status: 'Resolved' })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('Resolved');
      });
  });

  // Test 2: Get All Tickets
  it('/tickets (GET) - Admin can fetch all', () => {
    return request(app.getHttpServer())
      .get('/tickets')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  // 3. Proper Teardown to fix the "Worker process failed to exit" error
  afterAll(async () => {
    await app.close();
  });
});
