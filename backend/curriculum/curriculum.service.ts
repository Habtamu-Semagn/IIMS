import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@Injectable()
export class CurriculumService {
  private readonly logger = new Logger(CurriculumService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * OBJECTIVE: Initialize a new curriculum tracking family.
   */
  async create(dto: CreateCurriculumDto) {
    this.logger.log(`Creating initial curriculum: ${dto.title}`);
    return this.prisma.curriculum.create({
      data: {
        ...dto,
        version: '1', // Start at 1
        status: 'Pending Approval',
        is_latest: false,
      },
    });
  }

  /**
   * OBJECTIVE: Versioning logic that prevents "Draft Bloat".
   */
  async update(id: string, dto: UpdateCurriculumDto) {
    const current = await this.prisma.curriculum.findUnique({
      where: { curriculum_id: id },
    });
    if (!current) throw new NotFoundException('Curriculum record not found');

    // SCENARIO 1: Branching from an Approved record
    if (current.status === 'Approved') {
      const latestInHistory = await this.prisma.curriculum.findFirst({
        where: { title: current.title },
        orderBy: { version: 'desc' },
      });

      const nextVersion = (
        parseInt(latestInHistory?.version ?? '0') + 1
      ).toString();

      // Remove unique identifiers to create a fresh row
      const {
        curriculum_id,
        approved_at,
        approved_by,
        created_at,
        ...baseData
      } = current;

      this.logger.log(
        `Branching NEW version (${nextVersion}) for title: ${current.title}`,
      );
      return this.prisma.curriculum.create({
        data: {
          ...baseData,
          ...dto,
          version: nextVersion,
          status: 'Pending Approval',
          is_latest: false,
        },
      });
    }

    // SCENARIO 2: Refining an existing Pending draft (prevents the 16x "Version 1" issue)
    this.logger.log(`Updating existing draft for ID: ${id}`);
    return this.prisma.curriculum.update({
      where: { curriculum_id: id },
      data: dto,
    });
  }

  /**
   * OBJECTIVE: Atomic state transition (The Highlander Rule: Only one Latest).
   */
  async approve(id: string, adminId: string) {
    return this.prisma.$transaction(async (tx) => {
      const target = await tx.curriculum.findUnique({
        where: { curriculum_id: id },
      });
      if (!target) throw new NotFoundException('Record not found');
      if (target.status === 'Approved')
        throw new ConflictException('Already approved');

      // 1. Demote any current live version for this specific title
      await tx.curriculum.updateMany({
        where: { title: target.title, is_latest: true, approved_by: adminId },
        data: { is_latest: false, status: 'Archived' },
      });

      // 2. Promote the target to 'Approved' and 'is_latest'
      this.logger.log(
        `[APPROVE] Promoting ${target.title} V${target.version} to LIVE`,
      );
      return tx.curriculum.update({
        where: { curriculum_id: id },
        data: {
          status: 'Approved',
          is_latest: true,
          approved_by: adminId,
          approved_at: new Date(),
        },
      });
    });
  }

  async findLiveCurriculums() {
    return this.prisma.curriculum.findMany({
      where: { is_latest: true, status: 'Approved' },
      include: {
        approver: { select: { name: true, role: true } },
      },
    });
  }

  async findPending() {
    return this.prisma.curriculum.findMany({
      where: { status: 'Pending Approval' },
      orderBy: { created_at: 'desc' },
    });
  }

  async findHistory(title: string) {
    return this.prisma.curriculum.findMany({
      where: { title },
      orderBy: { version: 'desc' },
    });
  }
  async cleanupDuplicates() {
    this.logger.log('Starting Database Normalization...');

    const allTitles = await this.prisma.curriculum.findMany({
      select: { title: true },
      distinct: ['title'],
    });

    for (const item of allTitles) {
      const records = await this.prisma.curriculum.findMany({
        where: { title: item.title, status: 'Pending Approval' },
        orderBy: { created_at: 'asc' },
      });

      if (records.length > 1) {
        // Keep the most recent one (the latest work)
        const keepId = records[records.length - 1].curriculum_id;

        // Delete all others
        const deleteIds = records
          .filter((r) => r.curriculum_id !== keepId)
          .map((r) => r.curriculum_id);

        await this.prisma.curriculum.deleteMany({
          where: { curriculum_id: { in: deleteIds } },
        });

        this.logger.warn(
          `Cleaned up ${deleteIds.length} duplicate drafts for: ${item.title}`,
        );
      }
    }
    this.logger.log('Database Reset Complete.');
  }
}
