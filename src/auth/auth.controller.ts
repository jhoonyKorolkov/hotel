import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Response,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from './enums/role.enum';
import { NotAuthenticatedGuard } from './guards/not-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(NotAuthenticatedGuard)
  @Post('/client/register')
  async register(@Body() user: CreateUserDto) {
    return await this.authService.register(user);
  }

  @UseGuards(NotAuthenticatedGuard, AuthGuard('local'))
  @Post('/auth/login')
  @HttpCode(200)
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
  @Post('/auth/logout')
  @HttpCode(200)
  logout(@Request() req, @Response() res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).send('Ошибка при выходе');
      }
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.send({ message: 'Вы вышли из системы' });
      });
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
