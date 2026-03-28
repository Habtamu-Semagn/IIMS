import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'supersecret', // move to env later
    }),
    PrismaModule, // 🔥 dependency for AuthService
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
