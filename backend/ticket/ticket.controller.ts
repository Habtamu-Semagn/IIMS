import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  // ✅ IT Coordinator submits ticket
  @Post()
  @Roles(Role.IT_COORDINATOR)
  create(@Body() dto: CreateTicketDto) {
    return this.service.create(dto);
  }

  // ✅ Admin views all tickets
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ Admin resolves ticket
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.service.update(id, dto);
  }
}
