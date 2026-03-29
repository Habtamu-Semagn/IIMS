import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'; // Added Missing Exceptions
import { PrismaService } from '../prisma/prisma.service';
import { AssetService } from '../asset/asset.service';
import { NotificationService } from '../notification/notification.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private assetService: AssetService,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateTicketDto, user: any) {
    const asset = await this.assetService.findOne(dto.asset_id);

    // Pragmatic check: Does coordinator belong to the asset's school?
    // Note: Assuming user.school_id is attached to JWT in your Guard
    if (user.role === 'IT_COORDINATOR' && asset.school_id !== user.school_id) {
      throw new UnauthorizedException('Not authorized for this school');
    }

    return this.prisma.ticket.create({
      data: {
        ...dto,
        status: 'Open',
        created_at: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({ include: { asset: true } });
  }

  async findOne(ticket_id: string, user: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { ticket_id },
      include: { asset: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    if (
      user.role === 'IT_COORDINATOR' &&
      ticket.asset.school_id !== user.school_id
    ) {
      throw new ForbiddenException('Access denied');
    }

    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.ticket.update({
      where: { ticket_id: id },
      data: {
        status: dto.status,
        resolved_at: dto.status === 'Resolved' ? new Date() : null,
      },
      include: {
        asset: { include: { school: { include: { itCoordinator: true } } } },
      },
    });

    // Notify Coordinator if they have an email
    const coordinatorEmail = ticket.asset?.school?.itCoordinator?.email;
    if (coordinatorEmail) {
      await this.notificationService.notifyTicketUpdate(
        coordinatorEmail,
        ticket.ticket_id,
        ticket.status,
      );
    }

    return ticket;
  }
}
