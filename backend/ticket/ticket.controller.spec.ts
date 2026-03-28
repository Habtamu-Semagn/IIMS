import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

describe('TicketController', () => {
  let controller: TicketController;

  const mockService = {
    create: jest.fn().mockResolvedValue({ ticket_id: 'uuid', status: 'Open' }),
    updateStatus: jest
      .fn()
      .mockResolvedValue({ ticket_id: 'uuid', status: 'Resolved' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [{ provide: TicketService, useValue: mockService }],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should create ticket', async () => {
    const res = await controller.create({
      asset_id: 'asset-uuid',
      issue_description: 'Issue',
    });
    expect(res).toEqual({ ticket_id: 'uuid', status: 'Open' });
  });

  it('should update ticket status', async () => {
    const res = await controller.updateStatus({
      ticket_id: 'uuid',
      status: 'Resolved',
    });
    expect(res).toEqual({ ticket_id: 'uuid', status: 'Resolved' });
  });
});
