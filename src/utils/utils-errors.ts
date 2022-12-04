import { ErrorReasons } from './constants';

interface ExceptionOptions {
  statusCode?: number;
  message?: string;
  reason?: string;
  errorData?: any;
}

export class HttpException extends Error {
  statusCode: number;
  message: string;
  reason: string;
  errorData: any;

  constructor({
    statusCode = 400,
    message = 'Error',
    reason = ErrorReasons.BAD_REQUEST,
    errorData = {},
  }: ExceptionOptions) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.reason = reason;
    this.errorData = errorData;
  }
}

export function throwErrorSimple(message: string, statusCode?: number): never {
  throw new HttpException({
    message,
    statusCode,
  });
}

export function throwNotFoundError(message: string = 'Not found'): never {
  throw new HttpException({
    statusCode: 404,
    message,
    reason: ErrorReasons.NOT_FOUND,
  });
}
