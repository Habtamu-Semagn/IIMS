import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    this.logger.log(
      `Registering new asset: ${dto.name} for School: ${dto.school_id}`,
    );
    return this.prisma.asset.create({
      data: dto,
    });
  }

  async findAll(schoolId?: string) {
    return this.prisma.asset.findMany({
      where: schoolId ? { school_id: schoolId } : {},
      include: {
        _count: {
          select: { tickets: { where: { status: 'Open' } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { asset_id: id },
      include: {
        school: true,
        tickets: {
          orderBy: { created_at: 'desc' },
          take: 5, // Show recent history only for performance
        },
      },
    });

    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }

  async findWithOpenTickets() {
    // Pragmatic Query: Finds assets that are currently "Down"
    return this.prisma.asset.findMany({
      where: {
        tickets: {
          some: { status: 'Open' },
        },
      },
      include: {
        school: { select: { name: true, region: true } },
        _count: {
          select: { tickets: { where: { status: 'Open' } } },
        },
      },
    });
  }

  async update(id: string, dto: UpdateAssetDto) {
    // Check existence first to provide a clean 404
    await this.findOne(id);

    return this.prisma.asset.update({
      where: { asset_id: id },
      data: dto,
    });
  }
}
