import { Role } from '../../auth/enums/role.enum';

export interface IUserByAdmin {
  id?: string;
  name: string;
  email: string;
  role: Role;
  contactPhone?: string;
}
