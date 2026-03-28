import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetService } from '../asset/asset.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private assetService: AssetService,
  ) {}

  // === Submit Ticket (IT Coordinator) ===
  async create(dto: CreateTicketDto) {
    // Step 1: Validate asset
    await this.assetService.findOne(dto.asset_id);

    // Step 2: Create ticket
    return this.prisma.ticket.create({
      data: {
        ...dto,
        status: 'Open',
        created_at: new Date(),
      },
    });
  }

  // === Admin views tickets ===
  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        asset: true,
      },
    });
  }

  // === View one ===
  async findOne(ticket_id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { ticket_id },
      include: {
        asset: true,
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  // === Update status (Admin resolution flow) ===
  async update(ticket_id: string, dto: UpdateTicketDto) {
    await this.findOne(ticket_id);

    return this.prisma.ticket.update({
      where: { ticket_id },
      data: {
        status: dto.status,
        resolved_at: dto.status === 'Resolved' ? new Date() : null,
      },
    });
  }
}
