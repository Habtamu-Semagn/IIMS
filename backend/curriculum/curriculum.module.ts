import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 This is the missing piece!
  providers: [CurriculumService],
  controllers: [CurriculumController],
  exports: [CurriculumService],
})
export class CurriculumModule {}
