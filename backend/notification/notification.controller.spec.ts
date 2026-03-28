import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should send notification', async () => {
    const res = await service.send({
      recipient: 'a@b.com',
      message: 'Test message',
    });
    expect(res).toEqual({ success: true });
  });

  it('should notify ticket status', async () => {
    const res = await service.notifyTicketStatus('a@b.com', 'T123', 'Resolved');
    expect(res).toEqual({ success: true });
  });
});
