import { IsString } from 'class-validator';

export class VerifyCertificateDto {
  @IsString()
  hash_or_qr: string;
}
