// backend/training/dto/register-attendance.dto.ts
export class RegisterAttendanceDto {
  teacher_id: string;
  training_id: string;
  status: 'Present' | 'Absent';
}
