import type { ApiUser, User } from '../interfaces';

export function createUserAdapter(data: ApiUser): User {
  return {
    id: data.id,
    name: data.username,
    email: data.email,
    profilePhoto: data.profilePhoto,
    emailVerifiedAt: data.emailVerifiedAt ? new Date(data.emailVerifiedAt) : undefined,
    isSuperUser: data.isSuperUser,
    isAdmin: data.isAdmin,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}
