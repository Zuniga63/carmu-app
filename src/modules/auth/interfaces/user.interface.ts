export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  emailVerifiedAt?: Date;
  isSuperUser: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
