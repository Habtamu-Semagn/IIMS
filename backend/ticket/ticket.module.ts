import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { AssetModule } from '../asset/asset.module';
import { PrismaModule } from 'prisma/prisma.module';
import { NotificationModule } from 'notification/notification.module';

@Module({
  imports: [AssetModule, PrismaModule, NotificationModule], // 🔥 dependency
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
