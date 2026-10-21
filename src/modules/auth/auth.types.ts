import { UserRole } from '../../common/constants/roles';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
};
