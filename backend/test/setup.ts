import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

export async function createTestApp(): Promise<{
  app: INestApplication;
  prisma: PrismaService;
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const prisma = moduleRef.get<PrismaService>(PrismaService);
  await prisma.$connect();

  // Clear test database
  await prisma.$transaction([
    prisma.certificate.deleteMany(),
    prisma.training.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.curriculum.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.school.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  return { app, prisma };
}
