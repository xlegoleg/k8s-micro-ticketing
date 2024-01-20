import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  public readonly STATUS_CODE = 404

  public readonly DEFAULT_MESSAGE = 'Path not found';

  public constructor() {
    super('Path not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.DEFAULT_MESSAGE }];
  }
}