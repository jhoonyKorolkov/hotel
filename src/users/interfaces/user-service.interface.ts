import { CreateUserDto } from '../dto/create-user.dto';
import { SearchUserParams } from './search-user-params.interface';
import { IUser } from './user.interface';

interface IUserService {
  create(data: Partial<CreateUserDto>): Promise<IUser>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: SearchUserParams): Promise<IUser[]>;
}

export { IUserService };
