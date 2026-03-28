import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
  async send(dto: SendNotificationDto) {
    // Here you can integrate actual email/SMS providers
    // For simplicity, we just log it
    console.log(
      `[Notification] To: ${dto.recipient} | Type: ${dto.type ?? 'EMAIL'} | Message: ${dto.message}`,
    );
    return { success: true };
  }

  async notifyTicketStatus(
    teacherEmail: string,
    ticketNumber: string,
    status: string,
  ) {
    const message = `Your ticket #${ticketNumber} status changed to ${status}`;
    return this.send({ recipient: teacherEmail, message });
  }

  async notifyCurriculumApproval(
    teacherEmail: string,
    curriculumTitle: string,
  ) {
    const message = `Curriculum "${curriculumTitle}" has been approved.`;
    return this.send({ recipient: teacherEmail, message });
  }

  async notifyCertificateIssued(teacherEmail: string, certificateId: string) {
    const message = `Certificate issued: ${certificateId}. You can download it now.`;
    return this.send({ recipient: teacherEmail, message });
  }
}
