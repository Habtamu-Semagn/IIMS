import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: any) {
    const hash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
      },
    });

    return user;
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException();

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new UnauthorizedException();

    const payload = {
      sub: user.user_id,
      role: user.role,
      email: user.email,
    };

    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
