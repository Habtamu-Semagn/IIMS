// dto/update-curriculum.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { CreateCurriculumDto } from './create-curriculum.dto';

// PartialType makes title, version, etc. from CreateCurriculumDto optional
export class UpdateCurriculumDto extends PartialType(CreateCurriculumDto) {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  approved_by?: string;

  @IsOptional()
  @IsDate() // Ensure this is validated as a Date
  approved_at?: Date;
}
