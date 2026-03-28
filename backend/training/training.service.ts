import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollTeacherDto } from './dto/enroll-teacher.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { VerifyCertificateDto } from './dto/verify-certificate.dto';
import * as crypto from 'crypto';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  async enrollTeacher(dto: EnrollTeacherDto) {
    // Check if teacher and training exist
    await this.prisma.teacher.findUniqueOrThrow({
      where: { teacher_id: dto.teacher_id },
    });
    await this.prisma.training.findUniqueOrThrow({
      where: { training_id: dto.training_id },
    });

    return this.prisma.attendance.create({
      data: {
        teacher_id: dto.teacher_id,
        training_id: dto.training_id,
        status: 'Enrolled',
      },
    });
  }

  async recordAttendance(dto: RecordAttendanceDto) {
    const attendance = await this.prisma.attendance.findFirst({
      where: { teacher_id: dto.teacher_id, training_id: dto.training_id },
    });
    if (!attendance) throw new NotFoundException('Enrollment not found');

    return this.prisma.attendance.update({
      where: { attendance_id: attendance.attendance_id },
      data: { status: dto.status },
    });
  }

  async generateCertificate(teacher_id: string, training_id: string) {
    const rawData = `${teacher_id}-${training_id}-${Date.now()}`;
    const sha256_hash = crypto
      .createHash('sha256')
      .update(rawData)
      .digest('hex');
    const qr_code = `QR:${sha256_hash}`; // Simplified

    return this.prisma.certificate.create({
      data: { teacher_id, training_id, sha256_hash, qr_code },
    });
  }

  async verifyCertificate(dto: VerifyCertificateDto) {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [{ sha256_hash: dto.hash_or_qr }, { qr_code: dto.hash_or_qr }],
      },
    });
    if (!cert) throw new NotFoundException('Certificate not valid');
    return cert;
  }
}
