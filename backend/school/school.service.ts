import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'; // Added ForbiddenException
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Role } from '../auth/roles.enum'; // 👈 Fix: Add this import

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSchoolDto) {
    return this.prisma.school.create({
      data: dto,
      include: { itCoordinator: true },
    });
  }

  // 👈 Fix: Added 'user' argument to match controller
  async findAll(user: any) {
    const whereClause =
      user.role === Role.IT_COORDINATOR ? { it_coordinator_id: user.sub } : {};

    return this.prisma.school.findMany({
      where: whereClause,
      include: {
        itCoordinator: true,
        _count: { select: { assets: true, teachers: true } },
      },
    });
  }

  // 👈 Fix: Added 'user' argument to match controller
  async findOne(id: string, user: any) {
    const school = await this.prisma.school.findUnique({
      where: { school_id: id },
      include: {
        itCoordinator: true,
        assets: true,
        teachers: true,
      },
    });

    if (!school) throw new NotFoundException('School not found');

    // Pragmatic Security: Prevent Coordinator from snooping other schools via ID guessing
    if (
      user.role === Role.IT_COORDINATOR &&
      school.it_coordinator_id !== user.sub
    ) {
      throw new ForbiddenException(
        'You do not have access to this school data',
      );
    }

    return school;
  }

  async update(id: string, dto: UpdateSchoolDto) {
    // We pass a dummy admin role here just to trigger the existence check
    await this.findOne(id, { role: Role.ADMIN });

    return this.prisma.school.update({
      where: { school_id: id },
      data: dto,
    });
  }

  async remove(id: string) {
    const school = await this.findOne(id, { role: Role.ADMIN });

    return this.prisma.school.delete({
      where: { school_id: id },
    });
  }
}
