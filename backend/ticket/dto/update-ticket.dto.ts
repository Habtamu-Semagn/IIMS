import { IsString, IsUUID } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  issue_description: string;
  @IsString()
  status?: string;
  @IsUUID()
  asset_id: string;
}
