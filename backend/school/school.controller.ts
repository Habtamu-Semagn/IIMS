import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
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

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSchoolDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findAll(@Req() req: any) {
    // Pragmatic Refinement: Pass the user context to handle data scoping
    return this.service.findAll(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findOne(@Param('id') id: string, @Req() req: any) {
    // Now matches the updated service signature: (id, user)
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
