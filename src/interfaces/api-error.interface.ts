export interface ApiErrorDetail {
  [key: string]: {
    message: string;
    value: unknown;
  };
}

export interface ApiError {
  statusCode: number;
  path: string;
  errorType: string;
  timestamp: string;
  errorMessage: string;
  errors: ApiErrorDetail;
}
