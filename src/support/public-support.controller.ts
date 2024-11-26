import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';

@Controller('common')
export class PublicSupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.MANAGER)
  @Get('support-requests/:id/messages')
  getMessagesFromSupport(@Param('id', ValidateObjectIdPipe) chatId: string, @Request() req) {
    return this.supportService.getMessagesFromSupport(chatId, req.user._id, req.user.role);
  }
}
