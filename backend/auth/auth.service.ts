// backend/src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Role } from './roles.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hash = await argon2.hash(dto.password);

    // Industrial Step: Validate if the user is ALLOWED to take this role
    const finalRole = await this.determineVerifiedRole(dto.role, dto.email);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
          role: finalRole,
        },
      });

      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('Email exists');
      throw new InternalServerErrorException();
    }
  }

  private async determineVerifiedRole(
    requestedRole: Role,
    email: string,
  ): Promise<Role> {
    const userCount = await this.prisma.user.count();

    // 1. BOOTSTRAP: First user is ALWAYS Admin
    if (userCount === 0) return Role.ADMIN;

    // 2. PROTECT ADMIN ROLE: Don't let random signups be Admin
    if (requestedRole === Role.ADMIN) {
      throw new UnauthorizedException(
        'Admin accounts must be created by an existing Admin.',
      );
    }

    // 3. AUTO-ASSIGN BY EMAIL: (Optional Industrial Logic)
    // If your school uses @it.school.com, auto-assign IT Coordinator
    if (email.endsWith('@it.school.com')) return Role.IT_COORDINATOR;

    // 4. DEFAULT: Return the requested role if it's not protected,
    // or default to Teacher.
    return requestedRole;
  }
  // auth.service.ts

  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // 2. Industrial Security: Use a generic error message
    // This prevents "Account Enumeration" (hackers guessing which emails exist)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Verify the hashed password
    const isPasswordValid = await argon2.verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. Generate the JWT (using the helper method we fixed earlier)
    // Note: We cast user_id to string because your Prisma uses UUIDs
    return this.generateToken(user.user_id, user.email, user.role as Role);
  }

  /**
   * Helper: Signs the JWT with the User ID and Role
   * This is what the RolesGuard looks at later
   */
  private async generateToken(userId: string, email: string, role: Role) {
    const payload = {
      sub: userId, // 'sub' is the standard JWT field for the subject (User ID)
      email,
      role,
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret-key';

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d', // Tokens should usually expire in 15m - 24h
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
