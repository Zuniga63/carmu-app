/**
 * This function is useful for decoding the given token, which was encoded by base64 encryption
 * @param token Backend token
 * @returns  Decoded token
 */
export const parseJwt = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    console.log('Error parsing token', e);
    return null;
  }
};

/**
 * This function checks if the given token is valid or expired.
 * @param token Backend token
 * @returns
 */
export const isApiTokenValid = (token?: string) => {
  if (!token) return false;

  const decodeToken = parseJwt(token);
  if (!decodeToken) return false;

  // ? In JavaScript, a time stamp is the number of milliseconds that have passed since January 1, 1970.
  const jwtExpireTimestamp = parseJwt(token).exp;

  // ? In this case, since the exp value is in seconds format,
  // ? we need to convert it to milliseconds format in the next step.
  const jwtExpireDateTime = new Date(jwtExpireTimestamp * 1000);

  // ? Now we have expiration date of the token
  if (jwtExpireDateTime < new Date()) return false;

  return true;
};
