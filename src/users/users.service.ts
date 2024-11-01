import { ConflictException, Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserParams } from './interfaces/search-user-params.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.shema';
import { Model } from 'mongoose';
import * as crypto from 'node:crypto';
import * as argon from 'argon2';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<IUser> {
    const existsUser = await this.userModel
      .findOne({ email: user.email })
      .exec();

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

    const currentUser: IUser = {
      name,
      id: _id.toString(),
      email,
    };
    return currentUser;
  }

  findAll(data: SearchUserParams): Promise<IUser[]> {
    return;
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const { name, passwordHash, contactPhone, _id } = await this.userModel
      .findOne({ email })
      .exec();

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
