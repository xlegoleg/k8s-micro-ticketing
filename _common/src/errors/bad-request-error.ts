import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  public STATUS_CODE = 400;

  public DEFAULT_MESSAGE = 'Bad request';

  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.message }];
  }
}