// backend/auth/dto/register.dto.ts
export class RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'it-coordinator';
}
