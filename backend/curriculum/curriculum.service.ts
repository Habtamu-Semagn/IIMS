import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCurriculumDto) {
    return this.prisma.curriculum.create({
      data: {
        ...dto,
      },
    });
  }

  async findAll() {
    return this.prisma.curriculum.findMany();
  }

  async findPending() {
    return this.prisma.curriculum.findMany({
      where: { status: 'Pending Approval' },
    });
  }

  async findApproved() {
    return this.prisma.curriculum.findMany({
      where: { status: 'Approved' },
    });
  }

  async findOne(curriculum_id: string) {
    const cur = await this.prisma.curriculum.findUnique({
      where: { curriculum_id },
    });
    if (!cur) throw new NotFoundException('Curriculum not found');
    return cur;
  }

  async approve(curriculum_id: string, admin_id: string) {
    await this.findOne(curriculum_id);

    return this.prisma.curriculum.update({
      where: { curriculum_id },
      data: {
        status: 'Approved',
        approved_by: admin_id,
        approved_at: new Date(),
      },
    });
  }
}
