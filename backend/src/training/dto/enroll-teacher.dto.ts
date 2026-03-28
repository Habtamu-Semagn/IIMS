import { IsUUID } from 'class-validator';

export class EnrollTeacherDto {
  @IsUUID()
  teacher_id: string;

  @IsUUID()
  training_id: string;
}
