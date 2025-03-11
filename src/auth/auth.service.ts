import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as argon from 'argon2';
import { IUser } from '../users/interfaces/user.interface';
import { LoginDto } from './dto/login.dto';
import { CustomLoggerService } from '../common/logger/services/custom-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      this.logger.error('Ошибка при регистрации пользователя', error.stack);
      throw new BadRequestException('Ошибка регистрации пользователя');
    }
  }

  async validateUser(email: string, password: string): Promise<IUser> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      const isPasswordValid = await argon.verify(user.passwordHash, password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный пароль');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        contactPhone: user.contactPhone,
      };
    } catch (error) {
      this.logger.error('Ошибка при валидации пользователя', error.stack);
      throw error;
    }
  }

  async login(user: LoginDto): Promise<Omit<LoginDto, 'id'>> {
    try {
      const { id, ...rest } = user as any;
      return rest;
    } catch (error) {
      this.logger.error('Ошибка при авторизации пользователя', error.stack);
      throw new UnauthorizedException('Ошибка при входе в систему');
    }
  }
}
