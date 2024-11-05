import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllUsersDto } from '../dto/find-all-user.dto';

import { IUser } from './user.interface';

interface IUserService {
  create(data: Partial<CreateUserDto>): Promise<IUser>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: FindAllUsersDto): Promise<IUser[]>;
}

export { IUserService };
