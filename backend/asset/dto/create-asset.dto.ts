import { IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsDateString()
  purchase_date: string;

  @IsDateString()
  warranty_expiry: string;

  @IsUUID()
  school_id: string;
}
