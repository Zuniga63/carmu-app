import { ApiUser } from './api-user.interface';

export interface ApiAuthResponse {
  user: ApiUser;
  access_token: string;
  old_access_token: string;
}
