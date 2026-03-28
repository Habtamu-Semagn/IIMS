import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSchoolDto) {
    return this.prisma.school.create({
      data: dto,
      include: {
        itCoordinator: true,
      },
    });
  }

  async findAll() {
    return this.prisma.school.findMany({
      include: {
        itCoordinator: true,
        assets: true,
        teachers: true,
      },
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { school_id: id },
      include: {
        itCoordinator: true,
        assets: true,
        teachers: true,
      },
    });

    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, dto: UpdateSchoolDto) {
    await this.findOne(id);

    return this.prisma.school.update({
      where: { school_id: id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.school.delete({
      where: { school_id: id },
    });
  }
}
