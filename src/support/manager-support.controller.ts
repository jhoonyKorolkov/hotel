import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SearchSupportTicketsDto } from './dto/search-support-tickets.dto';

@Controller('manager')
export class ManagerSupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @Get('support-requests')
  findAllSupportTicket(@Query() param: SearchSupportTicketsDto) {
    return this.supportService.findAllSupportTicketsByManager(param);
  }
}
