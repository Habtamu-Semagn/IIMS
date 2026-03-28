import { forwardRef, Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { SchoolModule } from '../school/school.module';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
  imports: [forwardRef(() => SchoolModule), PrismaModule], // 🔥 dependency
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService], // 🔥 used by Ticket module next
})
export class AssetModule {}
