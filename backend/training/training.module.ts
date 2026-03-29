import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust path if needed
import { NotificationModule } from '../notification/notification.module'; // 👈 Import the MODULE, not the Service

@Module({
  imports: [
    PrismaModule,
    NotificationModule, // 👈 This gives TrainingService access to NotificationService
  ],
  providers: [TrainingService],
  controllers: [TrainingController],
  // No need to export NotificationService here; TrainingModule doesn't own it.
})
export class TrainingModule {}
