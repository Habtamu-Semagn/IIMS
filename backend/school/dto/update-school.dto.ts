import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsUUID()
  it_coordinator_id?: string;
}
