import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule], // no dependencies for now
  providers: [TrainingService],
  controllers: [TrainingController],
})
export class TrainingModule {}
