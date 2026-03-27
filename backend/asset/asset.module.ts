import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [SchoolModule], // 🔥 dependency
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService], // 🔥 used by Ticket module next
})
export class AssetModule {}
