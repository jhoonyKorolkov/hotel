import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { FindAllUsersDto } from './dto/find-all-user.dto';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/admin/users')
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.createUserByAdmin(user);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/admin/users')
  async findAllUsersForAdmin(@Query() params: FindAllUsersDto) {
    return await this.usersService.findAll(params);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @Get('/manager/users')
  async findAllUsersForManager(@Query() params: FindAllUsersDto) {
    return await this.usersService.findAll(params);
  }
}
