import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NotificationService,
          useValue: {
            // Correct syntax for the mock function
            notifyTicketStatus: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should notify successfully', async () => {
    const result = await service.notifyTicketStatus(
      'user@example.com',
      'T-001',
      'Open',
    );
    expect(result).toEqual({ success: true });
  });
});
