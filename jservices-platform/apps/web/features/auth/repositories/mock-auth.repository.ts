import { sessionMock } from '@/mocks/session.mock';
import { AuthRepository } from './auth.repository';
import { Session } from '@jservices/contracts';

export const mockAuthRepository: AuthRepository = {
  async getSession(): Promise<Session> {
    return sessionMock;
  },
  async login(email, password): Promise<Session> {
    console.log('Mock login for:', email);
    return sessionMock;
  },
  async logout(): Promise<void> {
    console.log('Mock logout');
  }
};
