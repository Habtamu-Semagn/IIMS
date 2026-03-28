import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AssetModule } from 'asset/asset.module';

@Module({
  imports: [PrismaModule, AssetModule], // no dependencies for now
  providers: [SchoolService],
  controllers: [SchoolController],
  exports: [SchoolService], // 🔥 used by Asset module later
})
export class SchoolModule {}
