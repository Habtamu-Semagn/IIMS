// create-asset.dto.ts
import { IsString, IsNotEmpty, IsISO8601, IsUUID } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsISO8601() // Ensures strict YYYY-MM-DD or Full ISO format
  purchase_date: string;

  @IsISO8601()
  warranty_expiry: string;

  @IsUUID()
  school_id: string;
}
