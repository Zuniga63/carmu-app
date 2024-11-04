export interface ApiUser {
  id: string;
  username: string;
  email: string;
  profilePhoto?: string;
  emailVerifiedAt?: string;
  isSuperUser: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
