import { BaseError, ErrorDetail } from './base-error';
import { ErrorCodes } from './errors-code.enum';

export class DuplicateKeyError extends BaseError {
  constructor(message: string, errors: ErrorDetail, path?: string) {
    super(ErrorCodes.Conflict, 'Duplicate Key', message, errors, path);
  }
}
