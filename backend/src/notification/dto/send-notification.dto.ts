import { IsString, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  recipient: string; // email or phone number
  @IsString()
  message: string;
  @IsOptional()
  type?: 'EMAIL' | 'SMS';
}
