import type { User } from './user.interface';

export interface AuthResponse {
  user: User;
  accessToken: string;
  oldAccessToken: string;
}
