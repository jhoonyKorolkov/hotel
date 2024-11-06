import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserService } from './interfaces/user-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.shema';
import { Model } from 'mongoose';
import * as crypto from 'node:crypto';
import * as argon from 'argon2';
import { IUser } from './interfaces/user.interface';
import { IUserByAdmin } from './interfaces/user-created-by-admin.interface';
import { FindAllUsersDto } from './dto/find-all-user.dto';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<IUser> {
    const existsUser = await this.userModel.findOne({ email: user.email }).exec();

    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const salt = crypto.randomBytes(32);
    const hash = await argon.hash(user.password, { salt });

    const createdUser = new this.userModel({
      ...user,
      passwordHash: hash,
    });

    const { name, _id, email } = await createdUser.save();

    const currentUser = {
      name,
      id: _id.toString(),
      email,
    };
    return currentUser;
  }

  async createUserByAdmin(user: CreateUserDto): Promise<IUserByAdmin> {
    const existsUser = await this.userModel.findOne({ email: user.email }).exec();

    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const salt = crypto.randomBytes(32);
    const hash = await argon.hash(user.password, { salt });

    const createdUser = new this.userModel({
      ...user,
      passwordHash: hash,
    });

    const { name, _id, email, role, contactPhone } = await createdUser.save();

    const currentUser = {
      name,
      id: _id.toString(),
      email,
      role,
      contactPhone,
    };
    return currentUser;
  }

  async findAll(params: FindAllUsersDto): Promise<IUser[]> {
    const { limit, offset, email, name, contactPhone } = params;

    const filter: any = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (email) filter.emal = new RegExp(email, 'i');
    if (contactPhone) filter.contactPhone = new RegExp(contactPhone, 'i');

    return this.userModel.find(filter).skip(offset).limit(limit).exec();
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    const { name, passwordHash, contactPhone, _id } = user;

    const currentUser: IUser = {
      id: _id.toString(),
      name,
      email,
      passwordHash,
      contactPhone,
    };

    return currentUser;
  }
}
