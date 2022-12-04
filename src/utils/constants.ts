export class ErrorReasons {
  static BAD_REQUEST: string = 'BAD_REQUEST';
  static NOT_FOUND: string = 'NOT_FOUND';
  static UNAUTHORIZED: string = 'UNAUTHORIZED';
  static SERVER_ERROR: string = 'SERVER_ERROR';
  static ACCESS_TOKEN_INCORRECT: string = 'ACCESS_TOKEN_INCORRECT';
}

export class Constants {
  static HEADER_X_ACCESS_TOKEN: string = 'x-access-token';
}

export enum AccessTypeEnum {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CREATOR = 'CREATOR',
}