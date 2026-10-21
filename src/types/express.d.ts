import { UserRole } from '../common/constants/roles';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRole;
      };
      requestId?: string;
    }
  }
}

export {};
