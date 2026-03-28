import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SchoolService } from '../school/school.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService {
  constructor(
    private prisma: PrismaService,
    private schoolService: SchoolService,
  ) {}

  async create(dto: CreateAssetDto) {
    // ensure school exists
    await this.schoolService.findOne(dto.school_id);

    return this.prisma.asset.create({
      data: {
        ...dto,
        purchase_date: new Date(dto.purchase_date),
        warranty_expiry: new Date(dto.warranty_expiry),
      },
    });
  }

  async findAll() {
    return this.prisma.asset.findMany({
      include: {
        school: true,
        tickets: true,
      },
    });
  }

  async findOne(asset_id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { asset_id },
      include: {
        school: true,
        tickets: true,
      },
    });

    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async findBySchool(school_id: string) {
    return this.prisma.asset.findMany({
      where: { school_id },
    });
  }

  async update(asset_id: string, dto: UpdateAssetDto) {
    await this.findOne(asset_id);

    return this.prisma.asset.update({
      where: { asset_id },
      data: dto,
    });
  }

  async remove(asset_id: string) {
    await this.findOne(asset_id);

    return this.prisma.asset.delete({
      where: { asset_id },
    });
  }
}
