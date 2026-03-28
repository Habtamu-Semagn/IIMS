import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetController {
  constructor(private readonly service: AssetService) {}

  // ✅ ADMIN creates assets
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateAssetDto) {
    return this.service.create(dto);
  }

  // ✅ ADMIN sees all
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  // ✅ IT Coordinator sees own school assets
  @Get('school/:school_id')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findBySchool(@Param('school_id') school_id: string) {
    return this.service.findBySchool(school_id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ ADMIN updates
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.service.update(id, dto);
  }

  // ✅ ADMIN deletes
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
