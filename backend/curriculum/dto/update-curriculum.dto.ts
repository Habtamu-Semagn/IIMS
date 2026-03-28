import { IsString, IsOptional } from 'class-validator';

export class UpdateCurriculumDto {
  @IsOptional()
  @IsString()
  status?: string; // Pending Approval | Approved

  @IsOptional()
  @IsString()
  approved_by?: string;

  @IsOptional()
  approved_at?: Date;
}
