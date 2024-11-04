import type { ApiUser, User } from '../interfaces';
import type { ApiError } from '@/interfaces';

import { API_URL } from '@/config';
import { BadRequestError, DuplicateKeyError, ErrorCodes } from '@/utils/errors';
import { createUserAdapter } from '../adapters';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export async function registerNewUser(credentials: SignupData): Promise<User> {
  const url = `${API_URL}/auth/local/signup`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const error: ApiError = await res.json();
    const { statusCode, errorMessage, errors, path } = error;

    if (statusCode === ErrorCodes.BadRequest) throw new BadRequestError(errorMessage, errors, path);
    if (statusCode === ErrorCodes.UnprocessableEntity || statusCode === ErrorCodes.Conflict)
      throw new DuplicateKeyError(errorMessage, errors, path);

    throw new Error(errorMessage);
  }

  const data: ApiUser = await res.json();
  return createUserAdapter(data);
}
