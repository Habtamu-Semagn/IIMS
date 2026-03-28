import { IsUUID } from 'class-validator';

export class GenerateCertificateDto {
  @IsUUID()
  teacher_id: string;

  @IsUUID()
  training_id: string;
}
