import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'; // Added Req
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

  @Post()
  @Roles(Role.IT_COORDINATOR)
  create(@Body() dto: CreateTicketDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll(); // Ensure this exists in Service
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.IT_COORDINATOR)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.service.update(id, dto);
  }
}
