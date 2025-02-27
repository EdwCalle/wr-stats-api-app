import { Role } from '../enums/role.enum';

export interface CurrentUserI {
  uid: string;
  username: string;
  email: string;
  role: Role;
}
