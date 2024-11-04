export interface ErrorDetail {
  [key: string]: {
    message: string;
    value: any;
    children?: ErrorDetail;
  };
}

export class BaseError extends Error {
  timestamp: string;

  constructor(
    public statusCode: number,
    public type: string,
    public message: string,
    public errors: ErrorDetail,
    public path?: string,
  ) {
    super(message);
    this.timestamp = new Date().toISOString();
  }
}
