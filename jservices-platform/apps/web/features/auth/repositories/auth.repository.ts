import { Session } from '@jservices/contracts';

export interface AuthRepository {
  getSession(): Promise<Session>;
  login(email: string, password: string): Promise<Session>;
  logout(): Promise<void>;
}
