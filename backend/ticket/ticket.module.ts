import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { AssetModule } from '../asset/asset.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [AssetModule, PrismaModule], // 🔥 dependency
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
