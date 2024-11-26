import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SearchSupportTicketsDto } from './dto/search-support-tickets.dto';

@Controller('client')
export class ClientSupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('support-requests')
  createSupportTicket(@Body('text') text: string, @Request() req) {
    return this.supportService.createSupportTicket(req.user._id, text);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('support-requests')
  findAllSupportTicket(@Query() param: SearchSupportTicketsDto, @Request() req) {
    return this.supportService.findAllSupportTicketsByClient(req.user._id, param);
  }
}
