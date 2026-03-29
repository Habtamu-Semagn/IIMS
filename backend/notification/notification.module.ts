// notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService],
  exports: [NotificationService], // 👈 This "publishes" the service for other modules
})
export class NotificationModule {}
