import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  region: string;

  @IsOptional()
  @IsUUID()
  it_coordinator_id?: string;
}
