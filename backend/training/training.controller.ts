import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { EnrollTeacherDto } from './dto/enroll-teacher.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { VerifyCertificateDto } from './dto/verify-certificate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { Public } from '../auth/public.decorator'; // Pragmatic addition

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly service: TrainingService) {}

  // ✅ TEACHERS can self-enroll in available trainings
  @Post('enroll')
  @Roles(Role.TEACHER)
  enroll(@Body() dto: EnrollTeacherDto) {
    return this.service.enrollTeacher(dto);
  }

  // ✅ ADMINS record attendance (which triggers auto-certification)
  @Patch('attendance')
  @Roles(Role.ADMIN)
  attendance(@Body() dto: RecordAttendanceDto) {
    return this.service.recordAttendance(dto);
  }

  // ✅ PUBLIC Verification
  // Pragmatically, verification shouldn't require a login so
  // employers/officials can scan a QR code anywhere.
  @Public()
  @Post('certificate/verify')
  verify(@Body() dto: VerifyCertificateDto) {
    return this.service.verifyCertificate(dto);
  }

  // ✅ ADMIN view of all issued certificates
  @Get('certificates')
  @Roles(Role.ADMIN)
  findAllCertificates(@Query('teacher_id') teacherId?: string) {
    // This allows for a search-by-teacher audit
    return this.service.findAllCertificates(teacherId);
  }
}
