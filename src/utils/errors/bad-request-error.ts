import { BaseError, ErrorDetail } from './base-error';
import { ErrorCodes } from './errors-code.enum';

export class BadRequestError extends BaseError {
  constructor(message: string, errors: ErrorDetail, path?: string) {
    super(ErrorCodes.BadRequest, 'Bad Request', message, errors, path);
  }
}
