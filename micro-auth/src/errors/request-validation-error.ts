import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  public readonly STATUS_CODE = 400;

  public readonly DEFAULT_MESSAGE = 'Alternative request validation error';

  public get errors() {
    return this.thrownErrors ?? [{ msg: this.DEFAULT_MESSAGE, type: 'alternative', path: 'alternative' }];
  }

  public constructor(private thrownErrors?: ValidationError[]) {
    super('Invalid request params');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors() {
    return this.errors?.map((error) => ({ message: error.msg, field: error.type === 'field' ? error.path : 'alternative' }))
  }
}