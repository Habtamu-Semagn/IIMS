import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCurriculumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  file_path: string;
}
