// notification/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async send(dto: SendNotificationDto) {
    this.logger.log(`[NOTIFY] ${dto.recipient}: ${dto.message}`);
    return { success: true };
  }

  // ✅ New Method: Fixes TrainingService Error
  async notifyCertificateReady(email: string, title: string) {
    return this.send({
      recipient: email,
      message: `Your certificate for "${title}" is ready. Download it from your dashboard.`,
    });
  }

  async notifyTicketUpdate(email: string, id: string, status: string) {
    return this.send({
      recipient: email,
      message: `Ticket #${id.slice(0, 8)} is now ${status}.`,
    });
  }
}
