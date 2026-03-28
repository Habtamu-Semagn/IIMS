import { IsUUID, IsString } from 'class-validator';

export class AttendanceDto {
  @IsUUID()
  teacher_id: string;

  @IsUUID()
  training_id: string;

  @IsString()
  status: string; // Present / Absent
}
