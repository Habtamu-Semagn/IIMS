import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { EnrollTeacherDto } from './dto/enroll-teacher.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { VerifyCertificateDto } from './dto/verify-certificate.dto';
import * as crypto from 'crypto';

@Injectable()
export class TrainingService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async enrollTeacher(dto: EnrollTeacherDto) {
    const existing = await this.prisma.attendance.findFirst({
      where: { teacher_id: dto.teacher_id, training_id: dto.training_id },
    });
    if (existing) throw new BadRequestException('Teacher already enrolled');

    return this.prisma.attendance.create({
      data: { ...dto, status: 'Enrolled' },
    });
  }

  async recordAttendance(dto: RecordAttendanceDto) {
    const attendance = await this.prisma.attendance.findFirst({
      where: { teacher_id: dto.teacher_id, training_id: dto.training_id },
      include: { teacher: true, training: true },
    });
    if (!attendance) throw new NotFoundException('Enrollment not found');

    const updated = await this.prisma.attendance.update({
      where: { attendance_id: attendance.attendance_id },
      data: { status: dto.status },
    });

    if (dto.status === 'Present') {
      const cert = await this.generateCertificate(
        dto.teacher_id,
        dto.training_id,
      );
      await this.notificationService.notifyCertificateReady(
        attendance.teacher.email,
        attendance.training.title,
      );
    }
    return updated;
  }

  // ✅ New Method: Fixes Controller Error
  async findAllCertificates(teacherId?: string) {
    return this.prisma.certificate.findMany({
      where: teacherId ? { teacher_id: teacherId } : {},
      include: {
        teacher: { select: { name: true, email: true } },
        training: { select: { title: true } },
      },
    });
  }

  // ✅ Fixed Method: Uses findFirst to avoid Prisma Type Mismatch (TS2322)
  async verifyCertificate(dto: VerifyCertificateDto) {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [{ sha256_hash: dto.hash_or_qr }, { qr_code: dto.hash_or_qr }],
      },
      include: {
        teacher: { select: { name: true } },
        training: { select: { title: true } },
      },
    });

    if (!cert) throw new NotFoundException('Certificate not valid or forged');
    return cert;
  }

  private async generateCertificate(teacher_id: string, training_id: string) {
    const existing = await this.prisma.certificate.findFirst({
      where: { teacher_id, training_id },
    });
    if (existing) return existing;

    const hash = crypto
      .createHash('sha256')
      .update(`${teacher_id}-${training_id}-${Date.now()}`)
      .digest('hex');
    return this.prisma.certificate.create({
      data: {
        teacher_id,
        training_id,
        sha256_hash: hash,
        qr_code: `VERIFY:${hash}`,
      },
    });
  }
}
