import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER, Role.IT_COORDINATOR)
  create(@Body() dto: CreateCurriculumDto) {
    return this.curriculumService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(@Param('id') id: string, @Body() dto: UpdateCurriculumDto) {
    return this.curriculumService.update(id, dto);
  }

  @Get('pending')
  @Roles(Role.ADMIN)
  findPending() {
    return this.curriculumService.findPending();
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.curriculumService.approve(id, adminId);
  }

  @Get('approved')
  @Roles(Role.TEACHER, Role.IT_COORDINATOR, Role.ADMIN)
  findLive() {
    return this.curriculumService.findLiveCurriculums();
  }

  @Get('history')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  getHistory(@Query('title') title: string) {
    return this.curriculumService.findHistory(title);
  }
  @Get('clean')
  @Roles(Role.ADMIN)
  findOne() {
    return this.curriculumService.cleanupDuplicates();
  }
}
