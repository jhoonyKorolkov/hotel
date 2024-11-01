import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from './enums/role.enum';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/client/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login(@Request() req) {
    return new Promise((resolve, reject) => {
      req.login(req.user, (err) => {
        if (err) {
          return reject(new UnauthorizedException(err));
        }
        resolve(this.authService.login(req.user));
      });
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
