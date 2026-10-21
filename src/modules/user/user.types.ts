import { UserRole } from '../../common/constants/roles';

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
};
