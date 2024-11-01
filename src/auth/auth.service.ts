import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { errors } from '../errors/errors';
import * as argon from 'argon2';
import { IUser } from '../users/interfaces/user.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(errors.userNotFоund);
    }

    const isPasswordValid = await argon.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      contactPhone: user.contactPhone,
    };
  }

  async login(user: LoginDto): Promise<Omit<LoginDto, 'id'>> {
    const { id, ...rest } = user as any;
    return rest;
  }
}
