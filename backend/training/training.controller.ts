import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { EnrollTeacherDto } from './dto/enroll-teacher.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { VerifyCertificateDto } from './dto/verify-certificate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly service: TrainingService) {}

  // Teacher enrollment
  @Post('enroll')
  @Roles(Role.TEACHER)
  enroll(@Body() dto: EnrollTeacherDto) {
    return this.service.enrollTeacher(dto);
  }

  // Admin records attendance
  @Patch('attendance')
  @Roles(Role.ADMIN)
  attendance(@Body() dto: RecordAttendanceDto) {
    return this.service.recordAttendance(dto);
  }

  // Admin generates certificate for teacher
  @Post('certificate')
  @Roles(Role.ADMIN)
  generateCertificate(@Body() dto: EnrollTeacherDto) {
    return this.service.generateCertificate(dto.teacher_id, dto.training_id);
  }

  // Verify certificate
  @Post('certificate/verify')
  @Roles(Role.ADMIN, Role.TEACHER)
  verify(@Body() dto: VerifyCertificateDto) {
    return this.service.verifyCertificate(dto);
  }
}
