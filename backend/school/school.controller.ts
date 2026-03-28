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

import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schools')
export class SchoolController {
  constructor(private readonly service: SchoolService) {}

  // ✅ Only ADMIN can create schools
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSchoolDto) {
    return this.service.create(dto);
  }

  // ✅ Admin + IT Coordinator can view
  @Get()
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ Only ADMIN updates
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.service.update(id, dto);
  }

  // ✅ Only ADMIN deletes
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
