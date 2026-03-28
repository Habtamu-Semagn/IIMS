import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly service: CurriculumService) {}

  // Editor uploads curriculum
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCurriculumDto) {
    return this.service.create(dto);
  }

  // Admin views pending approval
  @Get('pending')
  @Roles(Role.ADMIN)
  pending() {
    return this.service.findPending();
  }

  // Admin approves curriculum
  @Patch('approve/:id')
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string) {
    // assume admin_id is extracted from JWT
    const admin_id = 'TODO_FROM_JWT';
    return this.service.approve(id, admin_id);
  }

  // Teacher fetch approved curriculum
  @Get('approved')
  @Roles(Role.TEACHER, Role.IT_COORDINATOR, Role.ADMIN)
  approved() {
    return this.service.findApproved();
  }
}
