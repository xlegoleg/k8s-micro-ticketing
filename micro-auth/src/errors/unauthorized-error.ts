import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  public STATUS_CODE = 401;

  public DEFAULT_MESSAGE = 'Unauthorized';

  public constructor() {
    super('Unauthorized');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.DEFAULT_MESSAGE }];
  }
}